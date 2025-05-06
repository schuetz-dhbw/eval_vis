import React from 'react';

const TabNavigation = ({ activeTab, setActiveTab, tabs }) => {
    return (
        <div className="tab-navigation">
            {tabs.map(tab => (
                <button
                    key={tab.key}
                    className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.key)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

export default TabNavigation;