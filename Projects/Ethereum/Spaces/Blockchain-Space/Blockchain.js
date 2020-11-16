function newEthereumBlockchainSpace() {
    const MODULE_NAME = 'Blockchain Space'

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
        clientMap = undefined
    }

    function initialize() {

    }

    function physics() {
        networkClientStatusPhysics()
    }

    async function networkClientStatusPhysics() {

        /* We will query the node only every 3 seconds */
        if (lastTryToReconnectDatetime === undefined) {
            checkStatus()
            lastTryToReconnectDatetime = (new Date()).valueOf()
        } else {
            let now = (new Date()).valueOf()
            if (now - lastTryToReconnectDatetime > 3000) {
                checkStatus()
                lastTryToReconnectDatetime = now
            }
        }

        async function checkStatus() {
            try {
                if (UI.projects.superalgos.spaces.designSpace.workspace === undefined) { return }

                let blockchain = UI.projects.superalgos.spaces.designSpace.workspace.getHierarchyHeadsByType('Ethereum Blockchain')
                if (blockchain === undefined) { return }
                for (let i = 0; i < blockchain.blockchainNetworks.length; i++) {
                    let blockchainNetwork = blockchain.blockchainNetworks[i]
                    for (let j = 0; j < blockchainNetwork.networkClients.length; j++) {
                        let networkClient = blockchainNetwork.networkClients[j]

                        let config = JSON.parse(networkClient.config)
                        if (config.host === undefined) {
                            networkClient.payload.uiObject.setErrorMessage('Property host not defined at node config.')
                            continue
                        }
                        if (config.httpPort === undefined && config.webSocketsPort === undefined) {
                            networkClient.payload.uiObject.setErrorMessage('Property httpPort or webSocketsPort must be defined at node config.')
                            continue
                        }

                        /* Web Sockets would be the default protocol */
                        let clientPort
                        let clientInterface
                        if (config.webSocketsPort !== undefined) {
                            clientInterface = 'ws'
                            clientPort = config.webSocketsPort
                        } else {
                            clientInterface = 'http'
                            clientPort = config.httpPort
                        }

                        let params = {
                            method: 'getNetworkClientStatus',
                            host:  config.host,
                            port: clientPort,
                            interface: clientInterface
                        }
                
                        callWebServer(JSON.stringify(params), 'WEB3', onResponse)

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

                        async function showStatus(status) {

                            networkClient.payload.uiObject.resetErrorMessage()

                            if (status.isSyncing === false) {
                                networkClient.payload.uiObject.setStatus('Client is looking for peers...', 200)
                                return
                            }
                            /* If it is not syncing, then we have the current block and the highets block too */
                            let percentage = (status.isSyncing.currentBlock * 100 / status.isSyncing.highestBlock).toFixed(4)
                            let extraStatus = ''
                            if (status.isSyncing.highestBlock - status.isSyncing.currentBlock < 300) {
                                extraStatus = 'Block Download Phase Finished. Downloading Trie Data Structure.'
                            } else {
                                extraStatus = 'Block Download Phase.'
                                networkClient.payload.uiObject.setPercentage(percentage, 200)
                            }

                            networkClient.payload.uiObject.valueAtAngle = false
                            networkClient.payload.uiObject.setValue('Block ' + status.isSyncing.currentBlock + ' from ' + status.isSyncing.highestBlock + '. State ' + status.isSyncing.pulledStates + ' from ' + status.isSyncing.knownStates, 200)

                            if (status.isSyncing.currentBlock !== status.isSyncing.highestBlock) {
                                networkClient.payload.uiObject.setStatus('Connected via http. Client is Syncing... ' + extraStatus, 200)
                            } else {
                                networkClient.payload.uiObject.setStatus('Connected to ' + client.networkName + ' via http. ', 200)
                            }
                        }
                    }
                }
            } catch (err) {
                if (ERROR_LOG === true) { logger.write('[ERROR] checkStatus -> err = ' + err.stack) }
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
