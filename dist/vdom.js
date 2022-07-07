const TEXT_NODE = '#text';
export const h = (type, props = {}, ...children) => ({ type, props, children });
export const text = data => ({ type: TEXT_NODE, data });
const setProp = (node, key, value) => {
    if (key === 'key') {
    }
    else if (value == null || value === false) {
        node.removeAttribute(key);
    }
    else {
        node[key] = value;
    }
};
const createDomNode = vnode => {
    if (!vnode) {
        return;
    }
    if (vnode.type === TEXT_NODE) {
        const textNode = document.createTextNode(vnode.data);
        vnode.node = textNode;
        return textNode;
    }
    const { type, props, children } = vnode;
    const node = document.createElement(type);
    for (const [key, value] of Object.entries(props)) {
        setProp(node, key, value);
    }
    const fragment = document.createDocumentFragment();
    children.forEach(vChild => {
        if (!vChild) {
            return;
        }
        const childNode = createDomNode(vChild);
        fragment.appendChild(childNode);
    });
    node.appendChild(fragment);
    vnode.node = node;
    return node;
};
const patchChildren = (node, oldChildren, newChildren) => {
    const children = Array.from(node.children);
    const length = Math.max(oldChildren.length, newChildren.length);
    for (let i = 0; i < length; i++) {
        const oldChild = oldChildren[i];
        const newChild = newChildren[i];
        if (oldChild) {
            patch(node, oldChild, newChild);
        }
        else if (newChild) {
            const nodeChild = children[i];
            const newChildNode = createDomNode(newChild);
            if (nodeChild) {
                node.insertBefore(newChildNode, nodeChild);
            }
            else {
                node.appendChild(newChildNode);
            }
        }
    }
};
const patchProps = (node, oldProps, newProps) => {
    const props = Object.assign(Object.assign({}, oldProps), newProps);
    for (const [key, value] of Object.entries(props)) {
        if (Reflect.has(newProps, key)) {
            const oldValue = oldProps[key];
            if (oldValue !== value) {
                setProp(node, key, value);
            }
        }
        else {
            node.removeAttribute(key);
        }
    }
};
export const patch = (rootNode, oldTree, newTree) => {
    if (!oldTree && newTree) {
        const node = createDomNode(newTree);
        rootNode.appendChild(node);
        newTree.node = node;
    }
    else if (!newTree) {
        if (oldTree.type !== TEXT_NODE) {
            let child;
            while (child = oldTree.node.lastChild) {
                child.remove();
            }
        }
        oldTree.node.remove();
        oldTree.node = null;
    }
    else if (oldTree.type === TEXT_NODE &&
        newTree.type === TEXT_NODE) {
        if (oldTree.data !== newTree.data) {
            oldTree.node.data = newTree.data;
        }
        newTree.node = oldTree.node;
    }
    else if (oldTree.type === newTree.type &&
        oldTree.key === newTree.key) {
        patchChildren(oldTree.node, oldTree.children, newTree.children);
        patchProps(oldTree.node, oldTree.props, newTree.props);
        newTree.node = oldTree.node;
    }
    else {
        const newNode = createDomNode(newTree);
        rootNode.insertBefore(newNode, oldTree.node);
        oldTree.node.remove();
        oldTree.node = null;
        newTree.node = newNode;
    }
};
