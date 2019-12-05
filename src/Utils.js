export const vw = (count = 1) => Math.round(count * window.innerWidth / 100);
export const vh = (count = 1) => Math.round(count * window.innerHeight / 100);
export const directionExtractor = ({ x, y }) => {
    return [
        x === 0 ? 0 : Math.sign(x),
        y === 0 ? 0 : Math.sign(y)
    ];
};
export const mouseWheelExtractor = event => {
    return directionExtractor({
        x: event.deltaX,
        y: event.deltaY,
    });
};
/**
 * @param {number} from
 * @param {number} to
 * @param {number} ms
 * @param {function(value)} callback
 * @returns {Promise}
 */
export const numberTween = (from, to, ms, callback) => {
    return new Promise(resolve => {
        const startTime = Date.now();
        const animate = () => {
            const timeDiff = Date.now() - startTime;
            if (timeDiff >= ms) {
                callback(to);
                resolve();
            } else {
                callback(timeDiff / ms * (to - from) + from);
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    });
};
