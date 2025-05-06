import React from 'react';
import BaseChartComponent from '../charts/BaseChartComponent';
import { useTranslation } from '../../hooks/useTranslation';
import { CHART_DIMENSIONS } from '../../constants/chartConfig';
import useChart from '../../hooks/useChart';
import { CHART_TYPES } from '../../constants/chartConstants';

const GradeDistributionChart = ({ data, analysisType }) => {
    const t = useTranslation();
    const { chartColors } = useChart({
        analysisType,
        chartType: CHART_TYPES.BAR
    });

    return (
        <BaseChartComponent height={CHART_DIMENSIONS.DEFAULT_HEIGHT}>
            <div className="grade-distribution-chart">
                <div className="boxplot-stats">
                    <div className="boxplot-legend">
                        <div className="legend-item">
                            <span className="legend-color" style={{ backgroundColor: chartColors.PRIMARY }}></span>
                            <span>{t('ai', 'labels')}</span>
                        </div>
                        <div className="legend-item">
                            <span className="legend-color" style={{ backgroundColor: chartColors.SECONDARY }}></span>
                            <span>{t('human', 'labels')}</span>
                        </div>
                    </div>
                    <table className="boxplot-table">
                        <thead>
                        <tr>
                            <th></th>
                            <th>Min</th>
                            <th>Q1</th>
                            <th>Median</th>
                            <th>Q3</th>
                            <th>Max</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{t('ai', 'labels')}</td>
                            <td>{data[0].min.toFixed(2)}</td>
                            <td>{data[0].q1.toFixed(2)}</td>
                            <td>{data[0].median.toFixed(2)}</td>
                            <td>{data[0].q3.toFixed(2)}</td>
                            <td>{data[0].max.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>{t('human', 'labels')}</td>
                            <td>{data[1].min.toFixed(2)}</td>
                            <td>{data[1].q1.toFixed(2)}</td>
                            <td>{data[1].median.toFixed(2)}</td>
                            <td>{data[1].q3.toFixed(2)}</td>
                            <td>{data[1].max.toFixed(2)}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </BaseChartComponent>
    );
};

export default GradeDistributionChart;