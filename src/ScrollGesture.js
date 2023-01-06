import React from 'react';
import styled from '@emotion/styled';
import {keyframes} from '@emotion/react';

const arrows = {
    bottom: {
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

const ArrowBaseBottom = styled.div`
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
    animation-name: ${props => props.keyframes};
  }
`;

const Arrows = {
    top: styled(ArrowBaseBottom)`
      grid-column: s / e;
      grid-row: 1 / span 1;
      place-self: start center;

      top: 2vmin;

      &:before {
        top: 2vmin;
      }
    `,
    bottom: styled(ArrowBaseBottom)`
      grid-column: s / e;
      grid-row: 5 / span 1;
      place-self: end center;

      top: -2vmin;

      &:before {
        top: 6vmin;
      }
    `,
    right: styled(ArrowBaseBottom)`
      grid-column: 5 / span 1;
      grid-row: s / e;
      place-self: center end;
    `,
    left: styled(ArrowBaseBottom)`
      grid-column: 1 / span 1;
      grid-row: s / e;
      place-self: center start;
    `,
};

const ScrollGesture = props => {
    const {type} = props;
    const Wrapper = Arrows[type];

    return (
        <Wrapper keyframes={arrows[type].keyframes}/>
    );
};

export default ScrollGesture;
