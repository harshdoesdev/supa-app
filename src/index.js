import { h, patch, text, svg } from "./vdom.js";

export { h, text, svg };

export { createStore } from './store.js';

const patchSubscriptions = (prevSubscriptions, currentSubscriptions, dispatch) => {
   return currentSubscriptions.map((subscribe, i) => {
        const unsubscribe = prevSubscriptions[i];

        if(
            unsubscribe && 
            unsubscribe !== true && 
            !subscribe
        ) {
            unsubscribe();
        } else if(subscribe && !unsubscribe) {
            return subscribe(dispatch);
        } else if(subscribe && unsubscribe) {
            return unsubscribe;
        }
    });
};

export function runApp({ el, store, view, subscriptions }) {
    const rootNode = document.querySelector(el);

    const dispatch = store.dispatch.bind(store);

    let prevSubscriptions = [];

    let oldTree = null;

    store.subscribe(render);

    function render() {
        requestAnimationFrame(update)
    }

    function update() {
        const currentState = store.currentState;

        const newTree = view(currentState, dispatch);

        patch(rootNode, oldTree, newTree);

        oldTree = newTree;

        prevSubscriptions = patchSubscriptions(
            prevSubscriptions,
            subscriptions(currentState),
            dispatch
        );
    }

    render();
}