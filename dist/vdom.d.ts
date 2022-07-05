export function h(type: any, props?: {}, ...children: any[]): {
    type: any;
    props: {};
    children: any[];
};
export function text(data: any): {
    type: string;
    data: any;
};
export function patch(oldTree: any, newTree: any): void;
export function mount(vTree: any, rootNode: any): void;
