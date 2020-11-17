function newEthereumActionSwitch() {

    let thisObject = {
        executeAction: executeAction,
        initialize: initialize,
        finalize: finalize
    }

    /* Superalgos Function Libraries */
    let functionLibraryUiObjectsFromNodes = newUiObjectsFromNodes()

    /* Ethereum Function Libraries */
    let functionLibraryAccounts = newAccounts()

    return thisObject

    function finalize() {
        functionLibraryUiObjectsFromNodes = undefined
        functionLibraryAccounts = undefined
    }

    function initialize() {
        /* Nothing to initialize since a Function Library does not hold any state. */
    }

    async function executeAction(action) {
        switch (action.name) {
            case 'Create Wallet Account': {
                functionLibraryAccounts.createWalletAccount(action.node, functionLibraryUiObjectsFromNodes)
                break
            }
        }
    }
}
