import React from 'react';
import { CHART_TYPES } from '../../constants/chartTypes';
import { useTranslation } from '../../hooks/useTranslation';
import { useAppContext } from '../../AppContext';
import LineChartComponent from '../charts/LineChartComponent';
import ComposedChartComponent from '../charts/ComposedChartComponent';
import RadarChartComponent from '../charts/RadarChartComponent';
import BarChartComponent from '../charts/BarChartComponent';
import {getWeightedData} from "../../utils/dataTransformers";
import ChartErrorBoundary from '../charts/ChartErrorBoundary';
import DataErrorBoundary from '../common/DataErrorBoundary';

const ChartSection = ({ scoresData, combinedData, radarData }) => {
    const { chartType, currentWork, language } = useAppContext();
    const t = useTranslation(language);

    return (
        <div className="charts-grid">
            {/* Linien- oder kombiniertes Diagramm */}
            <div className="chart-container full-width">
                <h3 className="chart-title">
                    {chartType === CHART_TYPES.COMBINED ? t('combinedTitle', 'chartTitles') : t('vectors', 'chartTitles')}
                </h3>
                <div className="chart-wrapper">
                    <DataErrorBoundary data={chartType === CHART_TYPES.COMBINED ? combinedData : scoresData} language={language}>
                        <ChartErrorBoundary language={language}>
                            {chartType === CHART_TYPES.COMBINED ? (
                                <ComposedChartComponent
                                    data={combinedData}
                                    language={language}
                                />
                            ) : (
                                <LineChartComponent
                                    data={scoresData}
                                    chartType={chartType}
                                    language={language}
                                />
                            )}
                        </ChartErrorBoundary>
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
                        data={chartType === CHART_TYPES.COMBINED ? getWeightedData(currentWork, language) : scoresData}
                        language={language}
                    >
                        <ChartErrorBoundary language={language}>
                            <BarChartComponent
                                data={chartType === CHART_TYPES.COMBINED ?
                                    getWeightedData(currentWork, language) : scoresData}
                                chartType={chartType === CHART_TYPES.COMBINED ? 'weighted' : chartType}
                                language={language}
                            />
                        </ChartErrorBoundary>
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
                    <DataErrorBoundary data={radarData} language={language}>
                        <ChartErrorBoundary language={language}>
                            <RadarChartComponent
                                data={radarData}
                                chartType={chartType === CHART_TYPES.COMBINED ? 'weighted' : chartType}
                                language={language}
                            />
                        </ChartErrorBoundary>
                    </DataErrorBoundary>
                </div>
            </div>
        </div>
    );
};

export default ChartSection;
