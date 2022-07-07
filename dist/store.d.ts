export function createStore(reducer: any, initialState: any): Store;
declare class Store {
    constructor(reducer: any, initialState: any);
    set currentState(arg: any);
    get currentState(): any;
    reducer: any;
    subscribe(subscriber: any): () => void;
    unsubscribe(subscriber: any): void;
    dispatch(action: any): any;
    #private;
}
export {};
