import React, { useState, useEffect, useRef } from 'react';
import { fromEvent } from 'rxjs';
import { scan, filter } from 'rxjs/operators';

import './App.css';

const slides = [
    'Slide 1: Hi',
    'Slide 2: Welcome!',
    'Slide 3: End'
];

const Slide = (props) => (
    <div className="slide">
        <div>
            {props.data}
        </div>
    </div>
);
const KEYS = {
    UP: 38,
    RIGHT: 39,
    LEFT: 37,
    DOWN: 40,
};

/**
 * @param {number} from
 * @param {number} to
 * @param {number} ms
 * @param {function(value)} callback
 * @returns {Promise}
 */
const tween = (from, to, ms, callback) => {
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

export default () => {
    const [slide, setSlide] = useState(0);
    const [moving, setMoving] = useState(false);
    const [offsetY, setOffsetY] = useState(0);
    const doMove = offset => {
        setMoving(true);
        const newSlide = slide + offset;
        setSlide(newSlide);
        tween(-slide * window.innerHeight, -newSlide * window.innerHeight, 300, setOffsetY)
            .then(() => {
                setMoving(false);
            });
    };
    const handleKeyDown = event => {
        const { code, keyCode } = event;

        switch (keyCode) {
            case KEYS.UP:
                if (slide > 0) {
                    doMove(-1);
                }
                break;
            case KEYS.DOWN:
                if (slide < slides.length - 1) {
                    doMove(1);
                }
                break;
        }
    };

    useEffect(() => {
        const sub = fromEvent(document, 'keydown')
            .pipe(
                filter(() => !moving),
                filter(event => [KEYS.UP, KEYS.DOWN].includes(event.keyCode)),
            )
            .subscribe(handleKeyDown);
        return () => {
            sub.unsubscribe();
        };
    });

    return <div className="slides" style={{
        marginTop: `${offsetY}px`
    }}>
        {slides.map((slideData, id) =>
            <Slide key={id} data={slideData} />)
        }
    </div>;
};
