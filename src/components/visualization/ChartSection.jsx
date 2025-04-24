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
    const { chartType, currentWork } = useAppContext();
    const t = useTranslation();

    // Zentralisiertes Memoizing der Chart-Daten
    const chartData = useMemo(() => {
        if (!currentWork) return { scoresData: [], combinedData: [], radarData: [] };

        const scoresData = getScoresData(currentWork);
        const combinedData = getCombinedData(currentWork);
        const weightedData = getWeightedData(currentWork);

        const radarData = getRadarData(
            currentWork,
            chartType === CHART_TYPES.COMBINED ? 'weighted' : chartType
        );

        return {
            scoresData,
            combinedData,
            weightedData,
            radarData
        };
    }, [currentWork, chartType]);

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
                    >
                        {chartType === CHART_TYPES.COMBINED ? (
                            <ComposedChartComponent
                                data={chartData.combinedData}
                                chartType={chartType}
                            />
                        ) : (
                            <LineChartComponent
                                data={chartData.scoresData}
                                chartType={chartType}
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
                    >
                        <BarChartComponent
                            data={chartType === CHART_TYPES.COMBINED ? chartData.weightedData : chartData.scoresData}
                            chartType={chartType === CHART_TYPES.COMBINED ? 'weighted' : chartType}
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
};

export default ChartSection;