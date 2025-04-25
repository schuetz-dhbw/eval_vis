import React from 'react';

const CustomTooltip = ({ active, payload, formatter }) => {
    if (!active || !payload || !payload.length) {
        return null;
    }

    const data = payload[0].payload;

    return (
        <div className="custom-tooltip">
            {formatter(data)}
        </div>
    );
};

export default CustomTooltip;