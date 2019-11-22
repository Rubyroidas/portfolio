import React from 'react';

const Slide = (props) => {
    const { topExists, bottomExists, leftExists, rightExists } = props;

    return (<div className="slide" style={{
        left: `${props.col * 100}vw`,
        top: `${props.row * 100}vh`,
    }}>
        <div className="content">
            {props.data}
        </div>
        {topExists && <div className="arrow top">⬆</div>}
        {bottomExists && <div className="arrow bottom">⬇</div>}
        {leftExists && <div className="arrow left">⬅</div>}
        {rightExists && <div className="arrow right">➡</div>}
    </div>
    );
}

export default Slide;
