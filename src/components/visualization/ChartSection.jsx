import React, { memo, useMemo } from 'react';
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
    getCombinedData
} from "../../utils/dataTransformers";
import DataErrorBoundary from '../common/DataErrorBoundary';
import {ANALYSIS_TYPES } from "../../constants/chartConstants";

/**
 * ChartSection - Container für alle Chart-Komponenten
 *
 * @returns {JSX.Element} Container mit allen Charts
 */
const ChartSection = memo(() => {
    const { analysisType, currentWork, language } = useAppContext();
    const t = useTranslation();

    // Zentralisiertes Memoizing der Chart-Daten
    const chartData = useMemo(() => {
        const scoresData = getScoresData(currentWork, language);
        const weightsData = getWeightsData(currentWork, language);
        const combinedData = getCombinedData(currentWork, language);
        const weightedData = getWeightedData(currentWork, language);

        //const radarData = getRadarData(currentWork, analysisType, language);

        return {
            scoresData,
            weightsData,
            combinedData,
            weightedData
        };
    }, [currentWork, language]);

    // Fallback, wenn keine Daten verfügbar
    if (!currentWork) {
        return <div className="no-data-message">{t('noDataAvailable', 'errors')}</div>;
    }

    return (
        <div className="component-grid">
            {/* Linien- oder kombiniertes Diagramm */}
            <div className="component-container  full-width">
                <h3 className="section-title">
                    {analysisType === ANALYSIS_TYPES.COMBINED ? t('combinedTitle', 'chartTitles') : t('vectors', 'chartTitles')}
                </h3>
                <div className="chart-wrapper">
                    <DataErrorBoundary
                        data={analysisType === ANALYSIS_TYPES.COMBINED ? chartData.combinedData : chartData.scoresData}
                    >
                        {analysisType === ANALYSIS_TYPES.COMBINED ? (
                            <ComposedChartComponent
                                data={chartData.combinedData}
                                analysisType={analysisType}
                            />
                        ) : (
                            <LineChartComponent
                                data={
                                    analysisType === ANALYSIS_TYPES.WEIGHTS ? chartData.weightsData :
                                            chartData.scoresData
                                }
                                analysisType={analysisType}
                            />
                        )}
                    </DataErrorBoundary>
                </div>
            </div>

            {/* Balkendiagramm */}
            <div className="component-container  full-width">
                <h3 className="section-title">
                    {analysisType === ANALYSIS_TYPES.COMBINED ?
                        t('barWeighted', 'chartTitles') :
                        t('bar', 'chartTitles')}
                </h3>
                <div className="chart-wrapper">
                    <DataErrorBoundary
                        data={analysisType === ANALYSIS_TYPES.COMBINED ? chartData.weightedData : chartData.scoresData}
                    >
                        <BarChartComponent
                            data={
                                analysisType === ANALYSIS_TYPES.COMBINED ? chartData.weightedData :
                                    analysisType === ANALYSIS_TYPES.WEIGHTS ? chartData.weightsData :
                                            chartData.scoresData
                            }
                            analysisType={analysisType}
                        />
                    </DataErrorBoundary>
                </div>
            </div>

            {/* Spinnendiagramm */}
            <div className="component-container  full-width">
                <h3 className="section-title">
                    {analysisType === ANALYSIS_TYPES.COMBINED ?
                        `${t('radar', 'chartTitles')} (${t('weighted', 'analysisTypes')})` :
                        t('radar', 'chartTitles')}
                </h3>
                <div className="chart-wrapper radar-wrapper">
                    <DataErrorBoundary
                        data={analysisType === ANALYSIS_TYPES.COMBINED ? chartData.weightedData : chartData.scoresData}
                    >
                        <RadarChartComponent
                            data={
                                analysisType === ANALYSIS_TYPES.COMBINED ? chartData.weightedData :
                                    analysisType === ANALYSIS_TYPES.WEIGHTS ? chartData.weightsData :
                                        chartData.scoresData
                            }
                            analysisType={analysisType}
                        />
                    </DataErrorBoundary>
                </div>
            </div>
        </div>
    );
});

export default ChartSection;