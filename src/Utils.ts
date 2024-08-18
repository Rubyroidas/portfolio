export const vw = (count = 1) => Math.round(count * window.innerWidth / 100);
export const vh = (count = 1) => Math.round(count * window.innerHeight / 100);
export const directionExtractor = ({ x, y }: {x: number, y: number}) => {
    return [
        x === 0 ? 0 : Math.sign(x),
        y === 0 ? 0 : Math.sign(y)
    ];
};
export const mouseWheelExtractor = (event: WheelEvent) => {
    return directionExtractor({
        x: event.deltaX,
        y: event.deltaY,
    });
};
export const numberTween = (from: number, to: number, ms: number, callback: (value: number) => void): Promise<void> => {
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
