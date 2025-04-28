import React, { memo, useMemo } from 'react';
import { CHART_TYPES } from '../../constants/chartTypes';
import { useTranslation } from '../../hooks/useTranslation';
import { useAppContext } from '../../AppContext';
import LineChartComponent from '../charts/LineChartComponent';
import ComposedChartComponent from '../charts/ComposedChartComponent';
import RadarChartComponent from '../charts/RadarChartComponent';
import BarChartComponent from '../charts/BarChartComponent';
import {
    getWeightedData,
    getWeightsData,
    getScoresData,
    getCombinedData,
    getRadarData
} from "../../utils/dataTransformers";
import DataErrorBoundary from '../common/DataErrorBoundary';

/**
 * ChartSection - Container für alle Chart-Komponenten
 *
 * @returns {JSX.Element} Container mit allen Charts
 */
const ChartSection = memo(() => {
    const { chartType, currentWork, language } = useAppContext();
    const t = useTranslation();

    // Zentralisiertes Memoizing der Chart-Daten
    const chartData = useMemo(() => {
        if (!currentWork) return { scoresData: [], combinedData: [], radarData: [] };

        const scoresData = getScoresData(currentWork, language);
        const weightsData = getWeightsData(currentWork, language);
        const combinedData = getCombinedData(currentWork, language);
        const weightedData = getWeightedData(currentWork, language);

        const radarData = getRadarData(
            currentWork,
            chartType === CHART_TYPES.COMBINED ? 'weighted' : chartType,
            language
        );

        return {
            scoresData,
            weightsData,
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
        <div className="component-grid">
            {/* Linien- oder kombiniertes Diagramm */}
            <div className="component-container  full-width">
                <h3 className="section-title">
                    {chartType === CHART_TYPES.COMBINED ? t('combinedTitle', 'chartTitles') : t('vectors', 'chartTitles')}
                </h3>
                <div className="chart-wrapper">
                    <DataErrorBoundary
                        data={chartType === CHART_TYPES.COMBINED ? chartData.combinedData : chartData.scoresData}
                    >
                        {chartType === CHART_TYPES.COMBINED ? (
                            <ComposedChartComponent
                                data={chartData.combinedData}
                                chartType={chartType}
                            />
                        ) : (
                            <LineChartComponent
                                data={
                                    chartType === CHART_TYPES.WEIGHTS ? chartData.weightsData :
                                        chartType === CHART_TYPES.WEIGHTED ? chartData.weightedData :
                                            chartData.scoresData
                                }
                                chartType={chartType}
                            />
                        )}
                    </DataErrorBoundary>
                </div>
            </div>

            {/* Balkendiagramm */}
            <div className="component-container  full-width">
                <h3 className="section-title">
                    {chartType === CHART_TYPES.COMBINED ?
                        t('barWeighted', 'chartTitles') :
                        t('bar', 'chartTitles')}
                </h3>
                <div className="chart-wrapper">
                    <DataErrorBoundary
                        data={chartType === CHART_TYPES.COMBINED ? chartData.weightedData : chartData.scoresData}
                    >
                        <BarChartComponent
                            data={
                                chartType === CHART_TYPES.COMBINED ? chartData.weightedData :
                                    chartType === CHART_TYPES.WEIGHTS ? chartData.weightsData :
                                        chartType === CHART_TYPES.WEIGHTED ? chartData.weightedData :
                                            chartData.scoresData
                            }
                            chartType={chartType === CHART_TYPES.COMBINED ? 'weighted' : chartType}
                        />
                    </DataErrorBoundary>
                </div>
            </div>

            {/* Spinnendiagramm */}
            <div className="component-container  full-width">
                <h3 className="section-title">
                    {chartType === CHART_TYPES.COMBINED ?
                        `${t('radar', 'chartTitles')} (${t('weighted', 'chartTypes')})` :
                        t('radar', 'chartTitles')}
                </h3>
                <div className="chart-wrapper radar-wrapper">
                    <DataErrorBoundary data={chartData.radarData} >
                        <RadarChartComponent
                            data={chartData.radarData}
                            chartType={chartType === CHART_TYPES.COMBINED ? 'weighted' : chartType}
                        />
                    </DataErrorBoundary>
                </div>
            </div>
        </div>
    );
});

export default ChartSection;