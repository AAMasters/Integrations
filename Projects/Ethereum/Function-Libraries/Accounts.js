function newAccounts() {
    thisObject = {
        createWalletAccount: createWalletAccount
    }

    return thisObject

    function createWalletAccount(node, functionLibraryUiObjectsFromNodes) {

        let walletAccountNode = functionLibraryUiObjectsFromNodes.addUIObject(node, 'Wallet Account')

        let params = {
            method: 'createWalletAccount',
            entropy: walletAccountNode.id
        }

        let url = 'WEB3' // we don't need to ask this to any specific superalgos node.

        httpRequest(JSON.stringify(params), url, onResponse)

        function onResponse(err, data) {
            /* Lets check the result of the call through the http interface */
            if (err.result !== GLOBAL.DEFAULT_OK_RESPONSE.result) {
                networkClient.payload.uiObject.setErrorMessage('Call via HTTP Interface failed.')
                return
            }

            let response = JSON.parse(data)

            /* Lets check the result of the method call */
            if (response.result !== GLOBAL.DEFAULT_OK_RESPONSE.result) {
                networkClient.payload.uiObject.setErrorMessage('Call to WEB3 Server failed. ' + status.error)
                return
            }

            let config = {
                address: response.address,
                privateKey: response.privateKey
            }

            walletAccountNode.config = JSON.stringify(config)
            walletAccountNode.name = 
                address[address.length - 7] + 
                address[address.length - 6] + 
                address[address.length - 5] + 
                address[address.length - 4] + 
                address[address.length - 3] + 
                address[address.length - 2] + 
                address[address.length - 1] 
        }
    }
}
