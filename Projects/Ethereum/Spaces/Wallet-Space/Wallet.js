function newEthereumWalletSpace() {
    const MODULE_NAME = 'Wallet Space'

    let thisObject = {
        container: undefined,
        physics: physics,
        draw: draw,
        getContainer: getContainer,
        finalize: finalize,
        initialize: initialize
    }

    thisObject.container = newContainer()
    thisObject.container.initialize(MODULE_NAME)

    let lastTryToReconnectDatetime

    return thisObject

    function finalize() {

        thisObject.container.finalize()
        thisObject.container = undefined
    }

    function initialize() {

    }

    function physics() {
        walletBalancesPhysics()
    }

    async function walletBalancesPhysics() {

        /* We will query the node only every 3 seconds */
        if (lastTryToReconnectDatetime === undefined) {
            checkBalances()
            lastTryToReconnectDatetime = (new Date()).valueOf()
        } else {
            let now = (new Date()).valueOf()
            if (now - lastTryToReconnectDatetime > 3000) {
                checkBalances()
                lastTryToReconnectDatetime = now
            }
        }

        async function checkBalances() {
            try {
                if (UI.projects.superalgos.spaces.designSpace.workspace === undefined) { return }

                let wallets = []
                let hierarchyHeads = UI.projects.superalgos.spaces.designSpace.workspace.getHierarchyHeads()
                for (let i = 0; i < hierarchyHeads.length; i++) {
                    let hierarchyHead = hierarchyHeads[i]
                    if (hierarchyHead.type === 'Ethereum Wallet') {
                        wallets.push(hierarchyHead)
                    }
                }

                for (let i = 0; i < wallets.length; i++) {
                    let wallet = wallets[i]

                    let lightingPath = '' +
                        'Ethereum Wallet->' +
                        'Wallet Account->' +
                        'ETH Balance->' +
                        'Token Balance->' +
                        'Ethereum Token->' +
                        'ERC-20 Token Type->ERC-223 Token Type->ERC-721 Token Type->ERC-777 Token Type->'

                    let walletDefinition = UI.projects.superalgos.functionLibraries.protocolNode.getProtocolNode(wallet, false, true, true, false, false, lightingPath)

                    let networkClient = blockchainNetwork.networkClients[j]

                    let route = UI.projects.ethereum.utilities.routeToClient.buildRouteToClient(networkClient)

                    if (route === undefined) { continue } // something went wrong building the route.

                    route.params.method = 'getNetworkClientStatus'

                    httpRequest(JSON.stringify(route.params), route.url, onResponse)

                    function onResponse(err, data) {
                        /* Lets check the result of the call through the http interface */
                        if (err.result !== GLOBAL.DEFAULT_OK_RESPONSE.result) {
                            networkClient.payload.uiObject.setErrorMessage('Call via HTTP Interface failed.')
                            return
                        }

                        let status = JSON.parse(data)

                        /* Lets check the result of the method call */
                        if (status.result !== GLOBAL.DEFAULT_OK_RESPONSE.result) {
                            networkClient.payload.uiObject.setErrorMessage('Call to WEB3 Server failed. ' + status.error)
                            return
                        }

                        showStatus(status)
                    }
                }
            } catch (err) {
                console.log('[ERROR] checkBalances -> err = ' + err.stack)
            }
        }
    }

    function getContainer(point) {

        if (thisObject.container.frame.isThisPointHere(point, true) === true) {
            thisObject.container.space = MODULE_NAME
            return thisObject.container
        } else {
            return undefined
        }
    }

    function draw() {

    }
}
