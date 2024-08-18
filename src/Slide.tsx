import {ReactNode} from 'react';
import styled from '@emotion/styled';

import {vw, vh} from './Utils';
import ScrollGesture from './ScrollGesture';

const SlideWrapper = styled.div<{col: number, row: number}>`
  display: grid;
  grid-template-rows: 14vmin 1fr [s] auto [e] 1fr 14vmin;
  grid-template-columns: 14vmin 1fr [s] auto [e] 1fr 14vmin;
  overflow: hidden;
  position: absolute;
  width: ${() => vw(100)}px;
  height: ${() => vh(100)}px;
  left: ${props => vw(props.col * 100)}px;
  top: ${props => vh(props.row * 100)}px;
`;
const Content = styled.div`
  display: inline-block;
  grid-column: s / e;
  grid-row: s / e;
  font-size: 1rem;
  text-align: center;
  padding: 1vmin;
  
  & * {
    text-align: left;
  }
  & h1,
  & h2,
  & h3 {
    text-align: center;
  }
  & h1 {
    font-size: 1.8rem;
  }
  & h2 {
    font-size: 1.5rem;
  }
  & ul {
    list-style-type: disc;
  }
`;

type SlideProps = {
    topExists: boolean;
    bottomExists: boolean;
    leftExists: boolean;
    rightExists: boolean;
    col: number;
    row: number;
    data: ReactNode;
    viewport: {
        width: number;
        height: number;
    }
}

const Slide = (props: SlideProps) => {
    const { topExists, bottomExists, leftExists, rightExists } = props;

    return (<SlideWrapper col={props.col} row={props.row}>
        <Content>
            {props.data}
        </Content>
        {topExists && <ScrollGesture type="top"></ScrollGesture>}
        {bottomExists && <ScrollGesture type="bottom"></ScrollGesture>}
        {leftExists && <ScrollGesture  type="left"></ScrollGesture>}
        {rightExists && <ScrollGesture type="right"></ScrollGesture>}
        </SlideWrapper>
    );
};

export default Slide;
