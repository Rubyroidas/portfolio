import React from 'react';
import { fromEvent, merge } from 'rxjs';
import { scan, filter, map, switchMap, takeUntil, takeLast } from 'rxjs/operators';

import config from './config';
import Slide from './Slide';
import './App.css';

const slides = config.slides;
const COLS = Math.max(...slides.map(row => row.length));
const ROWS = slides.length;

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

/**
 * @param {number} from
 * @param {number} to
 * @param {number} ms
 * @param {function(value)} callback
 * @returns {Promise}
 */
const numberTween = (from, to, ms, callback) => {
    return new Promise(resolve => {
        let iterator = from;
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
}

const directionExtractor = ({ x, y }) => {
    return [
        x === 0 ? 0 : Math.sign(x),
        y === 0 ? 0 : Math.sign(y)
    ];
};
const mouseWheelExtractor = event => {
    return directionExtractor({
        x: event.deltaX,
        y: event.deltaY,
    });
};

export default class App extends React.Component {
    state = {
        slideCol: config.startSlideCol,
        slideRow: config.startSlideRow,
        moving: false,
        offsetX: -config.startSlideCol * 100,
        offsetY: -config.startSlideRow * 10
    }

    doMove(offsetX, offsetY) {
        if (offsetX !== 0) {
            const newSlideCol = this.state.slideCol + offsetX;
            const columnsCount = slides[this.state.slideRow].length;
            if (!(newSlideCol >= 0 && newSlideCol < columnsCount) || !slides[this.state.slideRow][newSlideCol]) {
                return;
            }
            numberTween(-this.state.slideCol * 100, -newSlideCol * 100, config.transitionDuration, value => {
                this.setState({
                    offsetX: value
                });
            })
                .then(() => {
                    this.setState({
                        moving: false
                    });
                });
            this.setState({
                moving: true,
                slideCol: newSlideCol
            });
        } else {
            const newSlideRow = this.state.slideRow + offsetY;
            if (!(newSlideRow >= 0 && newSlideRow < slides.length) || !slides[newSlideRow][this.state.slideCol]) {
                return;
            }
            numberTween(-this.state.slideRow * 100, -newSlideRow * 100, config.transitionDuration, value => {
                this.setState({
                    offsetY: value
                });
            })
                .then(() => {
                    this.setState({
                        moving: false
                    });
                });
            this.setState({
                moving: true,
                slideRow: newSlideRow
            });
        }
    }

    componentDidMount() {
        this.sub = merge(
            fromEvent(document, 'keydown')
                .pipe(
                    filter(() => !this.state.moving),
                    filter(event => Object.values(KEYS).includes(event.keyCode)),
                    map(event => KEY_MAP[event.keyCode])
                ),
            fromEvent(document, 'wheel')
                .pipe(
                    filter(() => !this.state.moving),
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
                                filter(() => !this.state.moving),
                                map(directionExtractor),
                            )
                    )
                )
        )
            .subscribe(offset => this.doMove(...offset));
    }

    componentWillUnmount() {
        this.sub.unsubscribe();
    }

    render() {
        return <div className="slides" style={{
            marginLeft: `${this.state.offsetX}vw`,
            marginTop: `${this.state.offsetY}vh`,
        }}>
            {slides.map((slideRowData, rowId) =>
                slideRowData.map((slideData, colId) =>
                    <Slide key={`${colId}-${rowId}`} data={slideData} col={colId} row={rowId}
                        topExists={slides[rowId - 1] && slides[rowId - 1][colId]}
                        bottomExists={slides[rowId + 1] && slides[rowId + 1][colId]}
                        leftExists={slides[rowId][colId - 1]}
                        rightExists={slides[rowId][colId + 1]}
                    />)
            )
            }
        </div>;
    }
}
