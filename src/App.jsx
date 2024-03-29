import React, { useState, useEffect, useRef } from 'react';
import { fromEvent, merge } from 'rxjs';
import { filter, map, switchMap, takeUntil, takeLast } from 'rxjs/operators';

import config from './config';
import Slide from './Slide';
import {vw, vh, directionExtractor, mouseWheelExtractor, numberTween} from './Utils';
import styled from "@emotion/styled";
// import './App.scss';

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

export default () => {
    const slideCol = useRef(config.startSlideCol);
    const slideRow = useRef(config.startSlideRow);
    const [moving, setMoving] = useState(false);
    const [offsetX, setOffsetX] = useState(-config.startSlideCol * 100);
    const [offsetY, setOffsetY] = useState(-config.startSlideRow * 100);
    const [viewport, setViewport] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    const doMove = (offsetX, offsetY) => {
        if (offsetX !== 0) {
            const newSlideCol = slideCol.current + offsetX;
            const columnsCount = slides[slideRow.current].length;
            if (!(newSlideCol >= 0 && newSlideCol < columnsCount) || !slides[slideRow.current][newSlideCol]) {
                return;
            }
            numberTween(-slideCol.current * 100, -newSlideCol * 100, config.transitionDuration, setOffsetX)
                .then(() => {
                    setMoving(false);
                });
            setMoving(true);
            slideCol.current = newSlideCol;
        } else {
            const newSlideRow = slideRow.current + offsetY;
            if (!(newSlideRow >= 0 && newSlideRow < slides.length) || !slides[newSlideRow][slideCol.current]) {
                return;
            }
            numberTween(-slideRow.current * 100, -newSlideRow * 100, config.transitionDuration, setOffsetY)
                .then(() => {
                    setMoving(false);
                });
            setMoving(true);
            slideRow.current = newSlideRow;
        }
    };
    const handleResize = () => {
        setViewport({
            width: window.innerWidth,
            height: window.innerHeight
        });
    };

    useEffect(() => {
        // viewport size
        window.addEventListener('resize', handleResize);
        // Rx
        const sub = merge(
            fromEvent(document, 'keydown')
                .pipe(
                    filter(() => !moving),
                    filter(event => Object.values(KEYS).includes(event.keyCode)),
                    map(event => KEY_MAP[event.keyCode])
                ),
            fromEvent(document, 'wheel')
                .pipe(
                    filter(() => !moving),
                    map(mouseWheelExtractor)
                ),
            fromEvent(document, 'touchstart')
                // Switch to listen to touchmove to determine position
                .pipe(
                    switchMap(startEvent =>
                        fromEvent(document, 'touchmove')
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
                                filter(() => !moving),
                                map(directionExtractor),
                            )
                    )
                )
        )
            .subscribe(offset => doMove(...offset));
        return () => {
            sub.unsubscribe();
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return <SlidesWrapper style={{
        marginLeft: `${vw(offsetX)}px`,
        marginTop: `${vh(offsetY)}px`,
    }}>
        {slides.map((slideRowData, rowId) =>
            slideRowData.map((slideData, colId) =>
                <Slide key={`${colId}-${rowId}`} data={slideData} col={colId} row={rowId}
                    topExists={slides[rowId - 1] && slides[rowId - 1][colId]}
                    bottomExists={slides[rowId + 1] && slides[rowId + 1][colId]}
                    leftExists={slides[rowId][colId - 1]}
                    rightExists={slides[rowId][colId + 1]}
                    viewport={viewport}
                />)
        )
        }
    </SlidesWrapper>;
};
