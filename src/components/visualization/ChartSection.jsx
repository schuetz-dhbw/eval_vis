import React, { useMemo } from 'react';
import { CHART_TYPES } from '../../constants/chartTypes';
import { useTranslation } from '../../hooks/useTranslation';
import { useAppContext } from '../../AppContext';
import LineChartComponent from '../charts/LineChartComponent';
import ComposedChartComponent from '../charts/ComposedChartComponent';
import RadarChartComponent from '../charts/RadarChartComponent';
import BarChartComponent from '../charts/BarChartComponent';
import {
    getWeightedData,
    getScoresData,
    getCombinedData,
    getRadarData
} from "../../utils/dataTransformers";
import DataErrorBoundary from '../common/DataErrorBoundary';
import '../visualization/styles/common.css';

/**
 * ChartSection - Container für alle Chart-Komponenten
 *
 * @returns {ReactElement} Container mit allen Charts
 */
const ChartSection = () => {
    const { chartType, currentWork, language } = useAppContext();
    const t = useTranslation(language);

    // Zentralisiertes Memoizing der Chart-Daten
    const chartData = useMemo(() => {
        if (!currentWork) return { scoresData: [], combinedData: [], radarData: [] };

        const scoresData = getScoresData(currentWork, language);
        const combinedData = getCombinedData(currentWork, language);
        const weightedData = getWeightedData(currentWork, language);

        const radarData = getRadarData(
            currentWork,
            language,
            chartType === CHART_TYPES.COMBINED ? 'weighted' : chartType
        );

        return {
            scoresData,
            combinedData,
            weightedData,
            radarData
        };
    }, [currentWork, language, chartType]);

    // Fallback, wenn keine Daten verfügbar
    if (!currentWork) {
        return <div className="no-data-message">{t('noDataAvailable', 'errors')}</div>;
    }

    return (
        <div className="charts-grid">
            {/* Linien- oder kombiniertes Diagramm */}
            <div className="chart-container full-width">
                <h3 className="chart-title">
                    {chartType === CHART_TYPES.COMBINED ? t('combinedTitle', 'chartTitles') : t('vectors', 'chartTitles')}
                </h3>
                <div className="chart-wrapper">
                    <DataErrorBoundary
                        data={chartType === CHART_TYPES.COMBINED ? chartData.combinedData : chartData.scoresData}
                        language={language}
                    >
                        {chartType === CHART_TYPES.COMBINED ? (
                            <ComposedChartComponent
                                data={chartData.combinedData}
                                chartType={chartType}
                                language={language}
                            />
                        ) : (
                            <LineChartComponent
                                data={chartData.scoresData}
                                chartType={chartType}
                                language={language}
                            />
                        )}
                    </DataErrorBoundary>
                </div>
            </div>

            {/* Balkendiagramm */}
            <div className="chart-container full-width">
                <h3 className="chart-title">
                    {chartType === CHART_TYPES.COMBINED ?
                        t('barWeighted', 'chartTitles') :
                        t('bar', 'chartTitles')}
                </h3>
                <div className="chart-wrapper">
                    <DataErrorBoundary
                        data={chartType === CHART_TYPES.COMBINED ? chartData.weightedData : chartData.scoresData}
                        language={language}
                    >
                        <BarChartComponent
                            data={chartType === CHART_TYPES.COMBINED ? chartData.weightedData : chartData.scoresData}
                            chartType={chartType === CHART_TYPES.COMBINED ? 'weighted' : chartType}
                            language={language}
                        />
                    </DataErrorBoundary>
                </div>
            </div>

            {/* Spinnendiagramm */}
            <div className="chart-container full-width">
                <h3 className="chart-title">
                    {chartType === CHART_TYPES.COMBINED ?
                        `${t('radar', 'chartTitles')} (${t('weighted', 'chartTypes')})` :
                        t('radar', 'chartTitles')}
                </h3>
                <div className="chart-wrapper radar-wrapper">
                    <DataErrorBoundary data={chartData.radarData} language={language}>
                        <RadarChartComponent
                            data={chartData.radarData}
                            chartType={chartType === CHART_TYPES.COMBINED ? 'weighted' : chartType}
                            language={language}
                        />
                    </DataErrorBoundary>
                </div>
            </div>
        </div>
    );
};

export default ChartSection;