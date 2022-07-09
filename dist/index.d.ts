export function runApp({ node, store, view, effects, subscriptions }: {
    node: any;
    store: any;
    view: any;
    effects: any;
    subscriptions: any;
}): void;
export { createStore } from "./store.js";
import { h } from "./vdom.js";
import { text } from "./vdom.js";
import { svg } from "./vdom.js";
export { h, text, svg };
