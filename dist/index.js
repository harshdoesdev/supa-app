import { deepFreeze, isFn } from "./util.js";
import { h, patch, text, svg } from "./vdom.js";
export { h, text, svg };
const patchSubscriptions = (currentState, prevSubscriptions, currentSubscriptions, setState) => {
    return currentSubscriptions.map((subscribe, i) => {
        const unsubscribe = prevSubscriptions[i];
        if (unsubscribe &&
            unsubscribe !== true &&
            !subscribe) {
            unsubscribe();
        }
        else if (subscribe && !unsubscribe) {
            return subscribe(currentState, setState);
        }
        else if (subscribe && unsubscribe) {
            return unsubscribe;
        }
    });
};
function shouldRunEffect(prevFxDependencies, dependencies) {
    if (!prevFxDependencies) {
        return true;
    }
    return dependencies.some((dependency, depId) => {
        const oldDependency = prevFxDependencies[depId];
        return oldDependency !== dependency;
    });
}
export function runApp({ node, state, effects, subscriptions, view }) {
    if (!node) {
        throw new Error('node cannot be null.');
    }
    if (!isFn(view)) {
        throw new Error('view must be a function.');
    }
    let currentState = null;
    let prevSubscriptions = [], prevFxDependencies = null;
    let oldTree = null;
    let id = null;
    function setState(newState) {
        const nextState = isFn(newState) ? newState(currentState) : newState;
        currentState = deepFreeze(nextState);
        render();
    }
    function render() {
        if (id) {
            cancelAnimationFrame(id);
        }
        id = requestAnimationFrame(update);
    }
    function updateEffects(currentState) {
        const currentEffects = effects(currentState);
        prevFxDependencies = currentEffects.map((fx, effectId) => {
            if (!fx) {
                return;
            }
            const [effect, ...dependencies] = fx;
            const shouldRun = shouldRunEffect(prevFxDependencies && prevFxDependencies[effectId], dependencies);
            if (shouldRun) {
                effect(setState, ...dependencies);
            }
            return dependencies;
        });
    }
    function updateSubscriptions(currentState) {
        prevSubscriptions = patchSubscriptions(currentState, prevSubscriptions, subscriptions(currentState), setState);
    }
    function update() {
        const newTree = view(currentState, setState);
        patch(node, oldTree, newTree);
        oldTree = newTree;
        if (isFn(effects)) {
            updateEffects(currentState);
        }
        if (isFn(subscriptions)) {
            updateSubscriptions(currentState);
        }
    }
    setState(state);
}
