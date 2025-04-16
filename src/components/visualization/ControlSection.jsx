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

    return (
        <div className="controls">
            <select
                className="dropdown-selector"
                value={selectedWorkIndex}
                onChange={(e) => setSelectedWorkIndex(parseInt(e.target.value))}
            >
                {works.map((work, index) => (
                    <option key={index} value={index}>
                        {work.title}
                    </option>
                ))}
            </select>
            <select
                className="dropdown-selector"
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
                className="dropdown-selector"
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