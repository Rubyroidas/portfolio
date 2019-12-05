import React from 'react';
/** @jsx jsx */
import {css, jsx, keyframes} from '@emotion/core';

const arrows = {
    bottom: {
        base: css`
            top: -2vmin;

            &:before {
                top: 6vmin;
            }
        `,
        keyframes: keyframes`
            0% {
                opacity: 1;
            }
            100% {
                opacity: 0;
                transform: translateY(-4vmin);
            }
        `,
    },
    top: {
        base: css`
            top: 2vmin;
            
            &:before {
                top: 2vmin;
            }
        `,
        keyframes: keyframes`
            0% {
                opacity: 1;
            }
            100% {
                opacity: 0;
                transform: translateY(4vmin);
            }
        `,
    },
};

const ScrollGesture = props => {
    const {type} = props;

    return (
        <div className={`arrow ${type}`}
            css={css`
            ${arrows[type].base}
    display: inline-block;
    position: relative;
    width: 6vmin;
    height: 10vmin;
    box-shadow: inset 0 0 0 1px #000;
    border-radius: 3vmin;

    &:before {
        position: absolute;
        left: 50%;
        content: '';
        width: 2vmin;
        height: 2vmin;
        background: #000;
        margin-left: -1vmin;
        border-radius: 1vmin;
        animation-duration: 1.5s;
        animation-iteration-count: infinite;
        animation-name: ${arrows[type].keyframes};
    }
            `}>
        </div>
    );
};

export default ScrollGesture;
