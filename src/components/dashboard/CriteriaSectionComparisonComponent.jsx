// src/components/dashboard/EnhancedCriteriaSectionComparisonComponent.jsx

import React, { useMemo } from 'react';
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, Cell } from 'recharts';
import { getDifferenceColor } from '../../utils/chartUtils';
import BaseChartComponent from '../charts/BaseChartComponent';
import useChart from '../../hooks/useChart';
import { CHART_TYPES, ANALYSIS_TYPES } from '../../constants/chartConstants';
import { CRITERIA_SECTIONS } from "../../constants/criteriaConstants";
import { calculateEnhancedSectionMetrics } from '../../utils/dataTransformers/enhancedCriteriaUtils';

const CriteriaSectionComparisonComponent = ({ works = [] }) => {
    const {
        t,
        chartColors,
        chartDimensions,
        commonChartConfig,
        defaultLegendProps,
        formatValue
    } = useChart({
        analysisType: ANALYSIS_TYPES.DASHBOARD,
        chartType: CHART_TYPES.BAR
    });

    // Calculate enhanced section metrics
    const sectionData = useMemo(() => {
        if (!works || works.length === 0) return [];
        return calculateEnhancedSectionMetrics(works, CRITERIA_SECTIONS);
    }, [works]);

    // Transform data with translations
    const chartData = sectionData.map(item => ({
        ...item,
        name: t(item.key, 'criteriaSection')
    }));

    if (!chartData || chartData.length === 0) {
        return <div className="no-data-message">{t('noDataAvailable', 'errors')}</div>;
    }

    const maxDiff = Math.max(...chartData.map(item => item.diff));

    return (
        <div className="component-container">
            <div className="interpretation-box">
                <div className="interpretation-content">
                    {t('enhancedSectionComparisonDescription', 'dashboard') ||
                        'This enhanced analysis compares criteria sections based only on evaluations where both AI and human assigned relevance (weight > 0%). This provides a more accurate comparison by excluding criteria where evaluators disagreed on relevance.'}
                </div>
            </div>

            <BaseChartComponent height={chartDimensions.height * 1.5}>
                <BarChart
                    data={chartData}
                    margin={commonChartConfig.margin}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip
                        formatter={(value, name) => [
                            `${value.toFixed(1)}%`,
                            name === 'diff'
                                ? t('avgDifference', 'metrics')
                                : (name === 'ai' ? t('ai', 'labels') : t('human', 'labels'))
                        ]}
                    />
                    <Legend {...defaultLegendProps} />
                    <Bar dataKey="ai" name={t('ai', 'labels')} fill={chartColors.PRIMARY} />
                    <Bar dataKey="human" name={t('human', 'labels')} fill={chartColors.SECONDARY} />
                    <Bar dataKey="diff" name={t('avgDifference', 'metrics')}>
                        {chartData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={getDifferenceColor(entry.diff, chartColors, { high: 25, medium: 15 })}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </BaseChartComponent>

            <h4 className="subtitle">{t('enhancedCriteriaSectionComparison', 'dashboard') || 'Enhanced Criteria Section Comparison'}</h4>

            <table className="data-table criteria-section-table">
                <thead>
                <tr>
                    <th>{t('section', 'tableHeaders')}</th>
                    <th>{t('aiAverage', 'tableHeaders')}</th>
                    <th>{t('humanAverage', 'tableHeaders')}</th>
                    <th>{t('avgDifference', 'tableHeaders')}</th>
                    <th>{t('validComparisons', 'tableHeaders') || 'Valid Comparisons'}</th>
                    <th>{t('weightingDisagreements', 'tableHeaders') || 'Weighting Disagreements'}</th>
                    <th>{t('relevanceRate', 'tableHeaders') || 'Relevance Rate'}</th>
                    <th>{t('visualization', 'dashboard')}</th>
                </tr>
                </thead>
                <tbody>
                {chartData.map((item, index) => {
                    const diffColor = getDifferenceColor(item.diff, chartColors, { high: 25, medium: 15 });
                    const barWidth = (item.diff / maxDiff) * 100;

                    return (
                        <tr key={item.key} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                            <td className="section-name">
                                <div className="section-info">
                                    <div className="section-title">{item.name}</div>
                                    <div className="section-subtitle">
                                        {CRITERIA_SECTIONS[item.key]?.length || 0} {t('criteria', 'labels')}
                                    </div>
                                </div>
                            </td>
                            <td className="score-cell">
                                <span className="score-value ai-score">
                                    {formatValue(item.ai)}%
                                </span>
                            </td>
                            <td className="score-cell">
                                <span className="score-value human-score">
                                    {formatValue(item.human)}%
                                </span>
                            </td>
                            <td className="score-cell">
                                <span
                                    className="score-value difference-value"
                                    style={{ color: diffColor }}
                                >
                                    {formatValue(item.diff)}%
                                </span>
                            </td>
                            <td className="count-cell">{item.validComparisons}</td>
                            <td className="count-cell">
                                <span style={{ color: item.disagreementRate > 0.3 ? chartColors.CRITICAL : chartColors.MODERATE }}>
                                    {item.weightingDisagreements} ({formatValue(item.disagreementRate * 100)}%)
                                </span>
                            </td>
                            <td className="count-cell">
                                <span style={{ color: item.relevanceRate > 0.7 ? chartColors.OPTIMAL : chartColors.MODERATE }}>
                                    {formatValue(item.relevanceRate * 100)}%
                                </span>
                            </td>
                            <td className="visualization-cell">
                                <div className="difference-bar-container">
                                    <div
                                        className="difference-bar"
                                        style={{
                                            width: `${barWidth}%`,
                                            backgroundColor: diffColor
                                        }}
                                    ></div>
                                </div>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>

            {/* Additional insights */}
            <div className="component-grid grid-2-cols" style={{ marginTop: 'var(--space-lg)' }}>
                <div className="info-box">
                    <h5 className="data-label">{t('avgRelevanceRate', 'dashboard') || 'Average Relevance Rate'}</h5>
                    <div className="data-value">
                        {formatValue(chartData.reduce((sum, item) => sum + item.relevanceRate, 0) / chartData.length * 100)}%
                    </div>
                    <div className="item-description">
                        {t('avgRelevanceRateDescription', 'dashboard') ||
                            'Percentage of evaluations where both AI and human considered criteria relevant'}
                    </div>
                </div>
                <div className="info-box">
                    <h5 className="data-label">{t('avgDisagreementRate', 'dashboard') || 'Average Disagreement Rate'}</h5>
                    <div className="data-value">
                        {formatValue(chartData.reduce((sum, item) => sum + item.disagreementRate, 0) / chartData.length * 100)}%
                    </div>
                    <div className="item-description">
                        {t('avgDisagreementRateDescription', 'dashboard') ||
                            'Percentage of evaluations where evaluators disagreed on criterion relevance'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CriteriaSectionComparisonComponent;