import { isFn } from "./util.js";
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

function shouldRunEffect(prevFxDependencies, dependencies, effectId) {
    if(!prevFxDependencies || !prevFxDependencies[effectId]) {
        return true;
    }

    return dependencies.every((dependency, depId) => {
        const oldDependency = prevFxDependencies[effectId][depId];

        return oldDependency !== dependency;
    });
}

export function runApp({ node, store, view, effects, subscriptions }) {
    const dispatch = store.dispatch.bind(store);

    let prevSubscriptions = [], prevFxDependencies = null;

    let oldTree = null;

    store.subscribe(render);

    function render() {
        requestAnimationFrame(update)
    }

    function updateEffects(currentState) {
        const currentEffects = effects(currentState);
        
        prevFxDependencies = currentEffects.map((fx, effectId) => {
            if(!fx) {
                return;
            }

            const [effect, ...dependencies] = fx;
            
            const shouldRun = shouldRunEffect(
                prevFxDependencies,
                dependencies,
                effectId
            );

            if(shouldRun) {
                effect(...dependencies);
            }

            return dependencies;
        });
    }

    function updateSubscriptions(currentState) {
        prevSubscriptions = patchSubscriptions(
            prevSubscriptions,
            subscriptions(currentState),
            dispatch
        );
    }

    function update() {
        const currentState = store.currentState;

        const newTree = view(currentState, dispatch);

        patch(node, oldTree, newTree);

        oldTree = newTree;

        if(isFn(effects)) {
            updateEffects(currentState);
        }

        if(isFn(subscriptions)) {
            updateSubscriptions(currentState);
        }
    }

    render();
}