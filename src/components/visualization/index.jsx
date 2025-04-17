import React, {useMemo} from 'react';
import './styles/common.css';
import { CHART_TYPES } from '../../constants/chartTypes';
import {
    getScoresData,
    getWeightsData,
    getWeightedData,
    getCombinedData,
    getRadarData,
} from '../../utils/dataTransformers';
import { useAppContext } from '../../AppContext';

import HeaderSection from './HeaderSection';
import ControlSection from './ControlSection';
import MetricsSection from './MetricsSection';
import ChartSection from './ChartSection';
import DetailsSection from './DetailsSection';
import UsageHintsSection from './UsageHintsSection';
import StatisticsSection from './StatisticsSection';
import WorkTypeAnalysisSection from './WorkTypeAnalysisSection';
import {translations} from "../../locales";

const Visualization = () => {
    // Context-Werte verwenden
    const {
        chartType, currentWork, language, rawWorks
    } = useAppContext();

    // Daten für die Diagramme basierend auf dem ausgewählten Typ
    const scoresData = useMemo(() => {
        switch(chartType) {
            case CHART_TYPES.WEIGHTS:
                return getWeightsData(currentWork,  translations, language);
            case CHART_TYPES.WEIGHTED:
                return getWeightedData(currentWork,  translations, language);
            case CHART_TYPES.COMBINED:
                return getCombinedData(currentWork,  translations, language);
            case CHART_TYPES.SCORES:
            default:
                return getScoresData(currentWork,  translations, language);
        }
    }, [currentWork, chartType, language]);

    const combinedData = useMemo(() => {
        return getCombinedData(currentWork,  translations, language);
    }, [currentWork, language]);

    const radarData = useMemo(() => {
        return getRadarData(currentWork,  translations, language);
    }, [currentWork, language, chartType]);

    return (
        <div className="visualization-container">
            <HeaderSection />

            <ControlSection />

            {chartType !== CHART_TYPES.WORK_TYPE_ANALYSIS && (
                <MetricsSection />
            )}

            {chartType === CHART_TYPES.STATISTICS ? (
                <StatisticsSection />
            ) : chartType === CHART_TYPES.WORK_TYPE_ANALYSIS ? (
                <WorkTypeAnalysisSection />
            ) : (
                <ChartSection
                    scoresData={scoresData}
                    combinedData={combinedData}
                    radarData={radarData}
                />
            )}

            {chartType !== CHART_TYPES.WORK_TYPE_ANALYSIS && (
                <DetailsSection />
            )}

            <UsageHintsSection />
        </div>
    );
};

export default Visualization;