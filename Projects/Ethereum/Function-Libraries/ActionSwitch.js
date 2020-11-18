function newEthereumActionSwitch() {

    let thisObject = {
        executeAction: executeAction,
        initialize: initialize,
        finalize: finalize
    }

    /* Superalgos Function Libraries */
    let UI.projects.superalgos.functionLibraries.uiObjectsFromNodes = newSuperalgosFunctionLibraryUiObjectsFromNodes()

    /* Ethereum Function Libraries */
    let UI.projects.ethereum.functionLibraries.accounts = newEthereumFunctionLibraryAccounts()

    return thisObject

    function finalize() {
        UI.projects.superalgos.functionLibraries.uiObjectsFromNodes = undefined
        UI.projects.ethereum.functionLibraries.accounts = undefined
    }

    function initialize() {
        /* Nothing to initialize since a Function Library does not hold any state. */
    }

    async function executeAction(action) {
        switch (action.name) {
            case 'Create Wallet Account': {
                UI.projects.ethereum.functionLibraries.accounts.createWalletAccount(action.node, UI.projects.superalgos.functionLibraries.uiObjectsFromNodes)
                break
            }
        }
    }
}
