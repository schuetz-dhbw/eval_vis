import React, {useMemo, useState} from 'react';
import './styles/common.css';
import { works } from '../../data/works';
import { translations } from '../../locales';
import { CHART_TYPES } from '../../data/chartTypes';
import {
    getScoresData,
    getWeightsData,
    getWeightedData,
    getCombinedData,
    getRadarData,
    getTranslatedWorks
} from '../../utils/dataTransformers';

import HeaderSection from './HeaderSection';
import ControlSection from './ControlSection';
import MetricsSection from './MetricsSection';
import ChartSection from './ChartSection';
import DetailsSection from './DetailsSection';
import UsageHintsSection from './UsageHintsSection';
import StatisticsSection from './StatisticsSection';
import WorkTypeAnalysisSection from './WorkTypeAnalysisSection';

const Visualization = () => {
    const [selectedWorkIndex, setSelectedWorkIndex] = useState(0);
    const [chartType, setChartType] = useState(CHART_TYPES.SCORES);
    const [language, setLanguage] = useState('de');
    const translatedWorks = useMemo(() => {
        return getTranslatedWorks(works, translations, language);
    }, [works, translations, language]);

    const work = translatedWorks[selectedWorkIndex];

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
                language={language}
            />

            <ControlSection
                works={translatedWorks}
                selectedWorkIndex={selectedWorkIndex}
                setSelectedWorkIndex={setSelectedWorkIndex}
                chartType={chartType}
                setChartType={setChartType}
                language={language}
                setLanguage={setLanguage}
            />

            {chartType !== CHART_TYPES.WORK_TYPE_ANALYSIS && (
                <MetricsSection
                    work={work}
                    language={language}
                    chartType={chartType}
                />
            )}

            {chartType === CHART_TYPES.STATISTICS ? (
                <StatisticsSection
                    work={work}
                    language={language}
                />
            ) : chartType === CHART_TYPES.WORK_TYPE_ANALYSIS ? (
                <WorkTypeAnalysisSection
                    works={works}
                    language={language}
                />
            ) : (
                <ChartSection
                    work={work}
                    scoresData={scoresData}
                    combinedData={combinedData}
                    radarData={radarData}
                    chartType={chartType}
                    language={language}
                />
            )}

            {chartType !== CHART_TYPES.WORK_TYPE_ANALYSIS && (
                <DetailsSection
                    work={work}
                    language={language}
                />
            )}

            <UsageHintsSection
                language={language}
                chartType={chartType}
            />
        </div>
    );
};

export default Visualization;