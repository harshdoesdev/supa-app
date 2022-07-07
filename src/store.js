import { deepFreeze, isPlainObj, kindOf } from "./util.js";

class Store {

    #state = null

    #isDispatching = false

    get currentState() {
        return this.#state;
    }

    constructor(reducer, initialState) {
        this.reducer = reducer;
        this.#state = deepFreeze(initialState);
    }

    dispatch(action) {
        if(!isPlainObj(action)) {
            throw new Error(`Action must be a plain object. Instead got: ${kindOf(action)}`)
        }

        if(this.#isDispatching) {
            throw new Error('Reducers may not dispatch actions.');
        }

        try {
            this.#isDispatching = true;

            const nextState = this.reducer(this.currentState, action);

            this.#state = deepFreeze(nextState);
        } finally {
            this.#isDispatching = false;
        }

        return action;
    }

}

export const createStore = (reducer, initialState) => new Store(reducer, initialState);