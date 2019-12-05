import React from 'react';

import {vw, vh} from './Utils';
import ScrollGesture from './ScrollGesture';

const Slide = (props) => {
    const { topExists, bottomExists, leftExists, rightExists } = props;

    return (<div className="slide" style={{
        width: `${vw(100)}px`,
        height: `${vh(100)}px`,
        left: `${vw(props.col * 100)}px`,
        top: `${vh(props.row * 100)}px`,
    }}>
        <div className="content">
            {props.data}
        </div>
        {topExists && <ScrollGesture type="top"></ScrollGesture>}
        {bottomExists && <ScrollGesture type="bottom"></ScrollGesture>}
        {leftExists && <ScrollGesture  type="left"></ScrollGesture>}
        {rightExists && <ScrollGesture type="right"></ScrollGesture>}
    </div>
    );
};

export default Slide;
