var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Store_state, _Store_isDispatching, _Store_subscribers;
import { deepFreeze, isFn, isPlainObj, kindOf } from "./util.js";
class Store {
    constructor(reducer, initialState) {
        _Store_state.set(this, null);
        _Store_isDispatching.set(this, false);
        _Store_subscribers.set(this, new Set());
        if (!isFn(reducer)) {
            throw new Error(`Reducer must be a function. Instead got: ${kindOf(reducer)}`);
        }
        this.reducer = reducer;
        __classPrivateFieldSet(this, _Store_state, deepFreeze(initialState), "f");
    }
    get currentState() {
        return __classPrivateFieldGet(this, _Store_state, "f");
    }
    set currentState(_value) {
        throw new Error(`Can't set current state directly.`);
    }
    subscribe(subscriber) {
        __classPrivateFieldGet(this, _Store_subscribers, "f").add(subscriber);
        return () => this.unsubscribe(subscriber);
    }
    unsubscribe(subscriber) {
        __classPrivateFieldGet(this, _Store_subscribers, "f").delete(subscriber);
    }
    dispatch(action) {
        if (!isPlainObj(action)) {
            throw new Error(`Action must be a plain object. Instead got: ${kindOf(action)}`);
        }
        if (__classPrivateFieldGet(this, _Store_isDispatching, "f")) {
            throw new Error('Reducers may not dispatch actions.');
        }
        try {
            __classPrivateFieldSet(this, _Store_isDispatching, true, "f");
            const nextState = this.reducer(this.currentState, action);
            __classPrivateFieldSet(this, _Store_state, deepFreeze(nextState), "f");
        }
        finally {
            __classPrivateFieldSet(this, _Store_isDispatching, false, "f");
        }
        __classPrivateFieldGet(this, _Store_subscribers, "f").forEach(subscriber => subscriber(this.currentState));
        return action;
    }
}
_Store_state = new WeakMap(), _Store_isDispatching = new WeakMap(), _Store_subscribers = new WeakMap();
export const createStore = (reducer, initialState) => new Store(reducer, initialState);
