import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { LANGUAGES } from '../../constants/languages';
import { useAppContext } from '../../AppContext';
import {ANALYSIS_TYPES} from "../../constants/chartConstants";

const ControlSection = () => {
    const {
        translatedWorks,
        selectedWorkIndex,
        setSelectedWorkIndex,
        analysisType,
        setAnalysisType,
        language,
        setLanguage
    } = useAppContext();

    const t = useTranslation();

    // Check if we should show the work selector
    const showWorkSelector = !(analysisType === ANALYSIS_TYPES.WORK_TYPE_ANALYSIS || analysisType === ANALYSIS_TYPES.DASHBOARD);

    return (
        <div className="controls">
            {/* Only show the work selector if not in Work Type Analysis mode */}
            {showWorkSelector && (
                <select
                    className="dropdown-selector work-selector"
                    value={selectedWorkIndex}
                    onChange={(e) => setSelectedWorkIndex(parseInt(e.target.value))}
                >
                    {translatedWorks.map((work, index) => (
                        <option key={index} value={index}>
                            {work.title}
                        </option>
                    ))}
                </select>
            )}
            <select
                className="dropdown-selector chart-selector"
                value={analysisType}
                onChange={(e) => setAnalysisType(e.target.value)}
            >
                {Object.values(ANALYSIS_TYPES).map((type) => (
                    <option key={type} value={type}>
                        {t(type, 'analysisTypes')}
                    </option>
                ))}
            </select>
            <select
                className="dropdown-selector language-selector"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
            >
                <option value={LANGUAGES.DE}>Deutsch</option>
                <option value={LANGUAGES.EN}>English</option>
            </select>
        </div>
    );
};

export default ControlSection;