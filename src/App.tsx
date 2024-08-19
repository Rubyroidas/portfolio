import { type Component, createSignal, onCleanup } from 'solid-js';
import { fromEvent, merge } from 'rxjs';
import { filter, map, switchMap, takeUntil, takeLast } from 'rxjs/operators';
import { styled } from 'solid-styled-components';

import {config} from './config';
import {Slide} from './Slide';
import {vw, vh, directionExtractor, mouseWheelExtractor, numberTween} from './Utils';

const slides = config.slides;

const KEYS = {
    UP: 38,
    RIGHT: 39,
    LEFT: 37,
    DOWN: 40,
};
const KEY_MAP = {
    [KEYS.UP]: [0, -1],
    [KEYS.DOWN]: [0, 1],
    [KEYS.LEFT]: [-1, 0],
    [KEYS.RIGHT]: [1, 0],
};

const SlidesWrapper = styled.div`
   position: relative;
`;

export const App: Component = () => {
    let slideCol = config.startSlideCol;
    let slideRow = config.startSlideRow;
    const [getMoving, setMoving] = createSignal(false);
    const [getOffsetX, setOffsetX] = createSignal(-config.startSlideCol * 100);
    const [getOffsetY, setOffsetY] = createSignal(-config.startSlideRow * 100);
    const [getViewport, setViewport] = createSignal({
        width: window.innerWidth,
        height: window.innerHeight
    });

    const doMove = (offsetX: number, offsetY: number) => {
        if (offsetX !== 0) {
            const newSlideCol = slideCol + offsetX;
            const columnsCount = slides[slideRow].length;
            if (!(newSlideCol >= 0 && newSlideCol < columnsCount) || !slides[slideRow][newSlideCol]) {
                return;
            }
            numberTween(-slideCol * 100, -newSlideCol * 100, config.transitionDuration, setOffsetX)
                .then(() => {
                    setMoving(false);
                });
            setMoving(true);
            slideCol = newSlideCol;
        } else {
            const newSlideRow = slideRow + offsetY;
            if (!(newSlideRow >= 0 && newSlideRow < slides.length) || !slides[newSlideRow][slideCol]) {
                return;
            }
            numberTween(-slideRow * 100, -newSlideRow * 100, config.transitionDuration, setOffsetY)
                .then(() => {
                    setMoving(false);
                });
            setMoving(true);
            slideRow = newSlideRow;
        }
    };
    const handleResize = () => {
        setViewport({
            width: window.innerWidth,
            height: window.innerHeight
        });
    };

    // viewport size
    window.addEventListener('resize', handleResize);
    // Rx
    const sub = merge(
        fromEvent<KeyboardEvent>(document, 'keydown')
            .pipe(
                filter(() => !getMoving()),
                filter(event => Object.values(KEYS).includes(event.keyCode)),
                map(event => KEY_MAP[event.keyCode])
            ),
        fromEvent<WheelEvent>(document, 'wheel')
            .pipe(
                filter(() => !getMoving()),
                map(mouseWheelExtractor)
            ),
        fromEvent<TouchEvent>(document, 'touchstart')
            // Switch to listen to touchmove to determine position
            .pipe(
                switchMap((startEvent: TouchEvent) =>
                    fromEvent<TouchEvent>(document, 'touchmove')
                        .pipe(
                            // Listen until "touchend" is fired
                            takeUntil(fromEvent(document, 'touchend')),
                            takeLast(1),
                            // Output the pageX location
                            map(event => ({
                                x: startEvent.touches[0].pageX - event.touches[0].pageX,
                                y: startEvent.touches[0].pageY - event.touches[0].pageY
                            })),
                            // Take the last output and filter it to output only swipes
                            // greater than the defined tolerance
                            map(({ x, y }) => ({
                                x: Math.abs(x) >= config.swipeTolerance ? x : 0,
                                y: Math.abs(y) >= config.swipeTolerance ? y : 0,
                            })),
                            filter(() => !getMoving()),
                            map(directionExtractor),
                        )
                )
            )
    )
        .subscribe(offset => doMove(offset[0], offset[1]));
    onCleanup(() => {
        sub.unsubscribe();
        window.removeEventListener('resize', handleResize);
    });

    return <SlidesWrapper style={{
        'margin-left': `${vw(getOffsetX())}px`,
        'margin-top': `${vh(getOffsetY())}px`,
    }}>
        {slides.map((slideRowData, rowId) =>
            slideRowData.map((slideData, colId) =>
                <Slide key={`${colId}-${rowId}`} data={slideData} col={colId} row={rowId}
                       topExists={!!(slides[rowId - 1] && slides[rowId - 1][colId])}
                       bottomExists={!!(slides[rowId + 1] && slides[rowId + 1][colId])}
                       leftExists={!!(slides[rowId][colId - 1])}
                       rightExists={!!(slides[rowId][colId + 1])}
                       viewport={getViewport()}
                />)
        )
        }
    </SlidesWrapper>;
};
