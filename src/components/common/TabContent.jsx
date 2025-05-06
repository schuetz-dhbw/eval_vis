import React from 'react';

const TabContent = ({ activeTab, tabKey, children }) => {
    if (activeTab !== tabKey) return null;

    return (
        <div className="tab-content">
            {children}
        </div>
    );
};

export default TabContent;