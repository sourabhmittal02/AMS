import { CommonActions } from '@react-navigation/native';

let navigator

function setTopLevelNavigator(navigatorRef) {
    navigator = navigatorRef
}

function navigate(name, params) {
    navigator.dispatch(
        CommonActions.navigate({
            name,
            params,
        })
    )
}

function navigateAndReset(name, params) {
    navigator.dispatch(
        CommonActions.reset({
            index: 0,
            routes: [{ name, params }],
        })
    )
}

export default {
    navigate,
    navigateAndReset,
    setTopLevelNavigator
}
