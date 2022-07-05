import { h, mount, patch, text } from "./vdom.js";
import { deepFreeze } from "./util.js";
export { h, text };
export function runApp({ el, state, actions, view }) {
    let currentState = deepFreeze(state);
    let oldTree = null;
    function dispatch({ type, payload }) {
        const action = actions[type];
        const frozenState = deepFreeze(currentState);
        update(action(frozenState, payload));
    }
    function update(newState) {
        const newTree = view(newState, dispatch);
        patch(oldTree, newTree);
        oldTree = newTree;
        currentState = newState;
    }
    oldTree = view(currentState, dispatch);
    mount(oldTree, document.querySelector(el));
}
