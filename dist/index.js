import { h, patch, text } from "./vdom.js";
export { h, text };
export { createStore } from './store.js';
const patchSubscriptions = (prevSubscriptions, currentSubscriptions, dispatch) => {
    return currentSubscriptions.map((subscribe, i) => {
        const unsubscribe = prevSubscriptions[i];
        if (unsubscribe &&
            unsubscribe !== true &&
            !subscribe) {
            unsubscribe();
        }
        else if (subscribe && !unsubscribe) {
            return subscribe(dispatch);
        }
        else if (subscribe && unsubscribe) {
            return unsubscribe;
        }
    });
};
export function runApp({ el, store, view, subscriptions }) {
    const rootNode = document.querySelector(el);
    let prevSubscriptions = [];
    let oldTree = null;
    function dispatch(action) {
        store.dispatch(action);
        requestAnimationFrame(update);
    }
    function update() {
        const newTree = view(store.currentState, dispatch);
        patch(rootNode, oldTree, newTree);
        oldTree = newTree;
        prevSubscriptions = patchSubscriptions(prevSubscriptions, subscriptions(store.currentState), dispatch);
    }
    update();
}
