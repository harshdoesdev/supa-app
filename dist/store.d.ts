export function createStore(reducer: any, initialState: any): Store;
declare class Store {
    constructor(reducer: any, initialState: any);
    get currentState(): any;
    reducer: any;
    dispatch(action: any): any;
    #private;
}
export {};
