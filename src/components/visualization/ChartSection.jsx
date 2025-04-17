import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import LineChartComponent from '../charts/LineChartComponent';
import ComposedChartComponent from '../charts/ComposedChartComponent';
import RadarChartComponent from '../charts/RadarChartComponent';
import BarChartComponent from '../charts/BarChartComponent';
import { CHART_TYPES } from '../../data/chartTypes';
import {getWeightedData} from "../../utils/dataTransformers";

const ChartSection = ({
                          work,
                          scoresData,
                          combinedData,
                          radarData,
                          chartType,
                          language
                      }) => {
    const t = useTranslation(language);

    return (
        <div className="charts-grid">
            {/* Linien- oder kombiniertes Diagramm */}
            <div className="chart-container full-width">
                <h3 className="chart-title">
                    {chartType === CHART_TYPES.COMBINED ? t('combinedTitle', 'chartTitles') : t('vectors', 'chartTitles')}
                </h3>
                <div className="chart-wrapper">
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
                    <BarChartComponent
                        data={chartType === CHART_TYPES.COMBINED ?
                            getWeightedData(work, language) : scoresData}
                        chartType={chartType === CHART_TYPES.COMBINED ? 'weighted' : chartType}
                        language={language}
                    />
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
                    <RadarChartComponent
                        data={radarData}
                        chartType={chartType === CHART_TYPES.COMBINED ? 'weighted' : chartType}
                        language={language}
                    />
                </div>
            </div>
        </div>
    );
};

export default ChartSection;
