export const deepFreeze = obj => {
    Object.values(obj).forEach(value => {
        if (typeof value === 'object' && !Object.isFrozen(value)) {
            deepFreeze(value);
        }
    });
    return Object.freeze(obj);
};
