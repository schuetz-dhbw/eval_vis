import React from 'react';

const InterpretationBox = ({ title, children }) => {
    return (
        <div className="interpretation-box">
            {title && <h5 className="interpretation-title">{title}</h5>}
            <div className="interpretation-content">
                {children}
            </div>
        </div>
    );
};

export default InterpretationBox;