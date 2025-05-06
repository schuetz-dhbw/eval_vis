import React from 'react';

const KPICardComponent = ({ title, value, description }) => {
    return (
        <div className={`info-box kpi`}>
            <h4 className="data-label">{title}</h4>
            <div className="data-value">{value}</div>
            {description && <p className="item-description">{description}</p>}
        </div>
    );
};

export default KPICardComponent;