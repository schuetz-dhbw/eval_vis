import React, { useState } from 'react';
import './styles/common.css';
import { works } from '../../data/works';
import { translations } from '../../locales';
import { CHART_TYPES } from '../../data/chartTypes';
import {
    getScoresData,
    getWeightsData,
    getWeightedData,
    getCombinedData,
    getRadarData
} from '../../utils/dataTransformers';

import HeaderSection from './HeaderSection';
import ControlSection from './ControlSection';
import ChartSection from './ChartSection';
import DetailsSection from './DetailsSection';
import UsageHintsSection from './UsageHintsSection';

const Visualization = () => {
    const [selectedWorkIndex, setSelectedWorkIndex] = useState(0);
    const [chartType, setChartType] = useState(CHART_TYPES.SCORES);
    const [language, setLanguage] = useState('de');

    const work = works[selectedWorkIndex];

    // Daten für die Diagramme basierend auf dem ausgewählten Typ
    const getCurrentChartData = () => {
        switch(chartType) {
            case CHART_TYPES.WEIGHTS:
                return getWeightsData(work, translations, language);
            case CHART_TYPES.WEIGHTED:
                return getWeightedData(work, translations, language);
            case CHART_TYPES.COMBINED:
                return getCombinedData(work, translations, language);
            case CHART_TYPES.SCORES:
            default:
                return getScoresData(work, translations, language);
        }
    };

    const scoresData = getCurrentChartData();
    const combinedData = getCombinedData(work, translations, language);
    const radarData = getRadarData(work, translations, language, chartType);

    return (
        <div className="visualization-container">
            <HeaderSection
                work={work}
                translations={translations}
                language={language}
            />

            <ControlSection
                works={works}
                selectedWorkIndex={selectedWorkIndex}
                setSelectedWorkIndex={setSelectedWorkIndex}
                chartType={chartType}
                setChartType={setChartType}
                language={language}
                setLanguage={setLanguage}
                translations={translations}
            />

            <ChartSection
                scoresData={scoresData}
                combinedData={combinedData}
                radarData={radarData}
                chartType={chartType}
                translations={translations}
                language={language}
            />

            <DetailsSection
                work={work}
                translations={translations}
                language={language}
            />

            <UsageHintsSection
                translations={translations}
                language={language}
            />
        </div>
    );
};

export default Visualization;