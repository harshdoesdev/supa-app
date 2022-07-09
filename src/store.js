import { deepFreeze, isFn, isPlainObj, kindOf } from "./util.js";

class Store {

    #state = null

    #isDispatching = false

    #subscribers = new Set()

    get currentState() {
        return this.#state;
    }

    set currentState(_value) {
        throw new Error(`Can't set current state directly.`);
    }

    constructor(reducer, initialState) {
        if(!isFn(reducer)) {
            throw new Error(
                `Reducer must be a function. Instead got: ${kindOf(reducer)}`
            );
        }

        this.reducer = reducer;
        this.#state = deepFreeze(initialState);
    }

    subscribe(subscriber) {
        this.#subscribers.add(subscriber);

        return () => this.unsubscribe(subscriber);
    }

    unsubscribe(subscriber) {
        this.#subscribers.delete(subscriber);
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

        this.#subscribers.forEach(subscriber => subscriber(this.currentState));

        return action;
    }

}

export const createStore = (reducer, initialState) => new Store(reducer, initialState);