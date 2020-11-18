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
