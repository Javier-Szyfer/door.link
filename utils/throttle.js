export const throttle = (callback, delay = 100) => {
    let throttle = false;
    return function (...args) {
        if (throttle) { return; } 
        throttle = setTimeout(function () {
            callback.apply(this, args);
            throttle = false;
        }, delay);
    };
};