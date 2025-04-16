// components/visualization/ControlSection.jsx
import React from 'react';
import './styles/controls.css';
import { getTranslation } from '../../utils/translationHelpers';
import { CHART_TYPES } from '../../data/chartTypes';

const ControlSection = ({
                            works,
                            selectedWorkIndex,
                            setSelectedWorkIndex,
                            chartType,
                            setChartType,
                            language,
                            setLanguage,
                            translations
                        }) => {
    const t = (key, section = null) => getTranslation(translations, language, key, section);

    // Check if we should show the work selector
    const showWorkSelector = chartType !== CHART_TYPES.WORK_TYPE_ANALYSIS;

    return (
        <div className="controls">
            {/* Only show the work selector if not in Work Type Analysis mode */}
            {showWorkSelector && (
                <select
                    className="dropdown-selector work-selector"
                    value={selectedWorkIndex}
                    onChange={(e) => setSelectedWorkIndex(parseInt(e.target.value))}
                >
                    {works.map((work, index) => (
                        <option key={index} value={index}>
                            {work.title}
                        </option>
                    ))}
                </select>
            )}
            <select
                className="dropdown-selector chart-selector"
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
            >
                {Object.values(CHART_TYPES).map((type) => (
                    <option key={type} value={type}>
                        {t(type, 'chartTypes')}
                    </option>
                ))}
            </select>
            <select
                className="dropdown-selector language-selector"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
            >
                <option value="de">Deutsch</option>
                <option value="en">English</option>
            </select>
        </div>
    );
};

export default ControlSection;