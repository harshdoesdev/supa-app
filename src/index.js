import { isFn } from "./util.js";
import { h, patch, text, svg } from "./vdom.js";

export { h, text, svg };

const patchSubscriptions = (
    currentState, 
    prevSubscriptions, 
    currentSubscriptions, 
    setState
) => {
   return currentSubscriptions.map((subscribe, i) => {
        const unsubscribe = prevSubscriptions[i];

        if(
            unsubscribe && 
            unsubscribe !== true && 
            !subscribe
        ) {
            unsubscribe();
        } else if(subscribe && !unsubscribe) {
            return subscribe(currentState, setState);
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

export function runApp({ node, state, view, effects, subscriptions }) {
    let currentState = null;

    let prevSubscriptions = [], prevFxDependencies = null;

    let oldTree = null;

    let id = null;

    function setState(newState) {
        currentState = isFn(newState) ? newState(currentState) : newState;
        render();
    }

    function render() {
        if(id) {
            cancelAnimationFrame(id);
        }
        
        id = requestAnimationFrame(update);
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
            currentState,
            prevSubscriptions,
            subscriptions(currentState),
            setState
        );
    }

    function update() {
        const newTree = view(currentState, setState);

        patch(node, oldTree, newTree);

        oldTree = newTree;

        if(isFn(effects)) {
            updateEffects(currentState);
        }

        if(isFn(subscriptions)) {
            updateSubscriptions(currentState);
        }
    }

    setState(state);
}