// src/components/visualization/ControlSection.jsx
import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { LANGUAGES } from '../../constants/languages';
import { useAppContext } from '../../AppContext';
import { ANALYSIS_TYPES } from "../../constants/chartConstants";

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

    // Nur die Dashboard-Bedingung bleibt übrig
    const showWorkSelector = analysisType !== ANALYSIS_TYPES.DASHBOARD;

    return (
        <div className="controls">
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
                {/* Kein Filter mehr nötig */}
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