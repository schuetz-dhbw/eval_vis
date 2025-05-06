import React from 'react';

const DashboardContainer = ({ title, children, className = '', fullWidth = false }) => {
    return (
        <div className={`component-container ${fullWidth ? 'full-width' : ''} ${className}`}>
            {title && <h4 className="subtitle">{title}</h4>}
            {children}
        </div>
    );
};

export default DashboardContainer;