// src/components/dashboard/EnhancedCriteriaComparisonComponent.jsx

import React, { useMemo, useState } from 'react';
import {BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar} from 'recharts';
import BaseChartComponent from '../charts/BaseChartComponent';
import CustomTooltip from '../charts/CustomTooltip';
import { getDifferenceColor, renderDashboardCriteriaBars } from '../../utils/chartUtils';
import useChart from "../../hooks/useChart";
import { CHART_TYPES } from "../../constants/chartConstants";
import { calculateEnhancedCriteriaMetrics } from '../../utils/dataTransformers/enhancedCriteriaUtils';
import TabNavigation from '../common/TabNavigation';
import TabContent from '../common/TabContent'

const CRITERIA_TABS = {
    VALID_COMPARISONS: 'validComparisons',
    WEIGHTING_DISAGREEMENTS: 'weightingDisagreements',
    ZERO_WEIGHT_ANALYSIS: 'zeroWeightAnalysis'
};

const CriteriaComparisonComponent = ({ rawWorks, analysisType }) => {
    const {
        t,
        chartDimensions,
        chartColors,
        commonChartConfig,
        defaultLegendProps,
        formatValue
    } = useChart({
        analysisType,
        chartType: CHART_TYPES.BAR
    });

    const [activeTab, setActiveTab] = useState(CRITERIA_TABS.VALID_COMPARISONS);

    // Calculate enhanced metrics
    const enhancedMetrics = useMemo(() => {
        console.log('Calculating enhanced metrics for rawWorks:', rawWorks?.length || 0);
        const result = calculateEnhancedCriteriaMetrics(rawWorks);
        console.log('Enhanced metrics result:', result);
        return result;
    }, [rawWorks]);

    if (!enhancedMetrics) {
        console.log('No enhanced metrics available');
        return <div className="no-data-message">{t('noDataAvailable', 'errors')}</div>;
    }

    console.log('Enhanced metrics summary:', enhancedMetrics.summary);

    // Transform data for charts with translations
    const validComparisonData = enhancedMetrics.validCriteriaAverages.map(item => ({
        name: t(item.key, 'works.criteriaLabels'),
        key: item.key,
        ai: item.ai,
        human: item.human,
        diff: item.diff,
        validComparisons: item.validComparisons,
        count: item.count
    }));

    const weightingDisagreementData = enhancedMetrics.weightingDisagreementStats.map(item => ({
        name: t(item.key, 'works.criteriaLabels'),
        key: item.key,
        aiOnlyPercentage: item.aiOnlyPercentage,
        humanOnlyPercentage: item.humanOnlyPercentage,
        disagreementRate: item.disagreementRate * 100,
        totalWorks: item.totalWorks
    }));

    const zeroWeightData = enhancedMetrics.zeroWeightAnalysis
        .filter(item => item.zeroWeightRate > 0)
        .map(item => ({
            name: t(item.key, 'works.criteriaLabels'),
            key: item.key,
            zeroWeightPercentage: item.zeroWeightRate * 100,
            relevancePercentage: item.relevanceRate * 100,
            validComparisons: item.validComparisons,
            totalWorks: item.totalWorks
        }));

    const tabs = [
        { key: CRITERIA_TABS.VALID_COMPARISONS, label: t('validComparisons', 'dashboard') || 'Valid Comparisons' },
        { key: CRITERIA_TABS.WEIGHTING_DISAGREEMENTS, label: t('weightingDisagreements', 'dashboard') || 'Weighting Disagreements' },
        { key: CRITERIA_TABS.ZERO_WEIGHT_ANALYSIS, label: t('zeroWeightAnalysis', 'dashboard') || 'Relevance Analysis' }
    ];

    const renderValidComparisonsTab = () => (
        <div>
            <div className="interpretation-box">
                <div className="interpretation-content">
                    {t('validComparisonsDescription', 'dashboard') ||
                        'This analysis shows only criteria where both AI and human evaluators assigned a weight > 0%, indicating both considered the criterion relevant for evaluation.'}
                </div>
            </div>

            <BaseChartComponent height={chartDimensions.height * 3}>
                <BarChart
                    data={validComparisonData}
                    margin={commonChartConfig.margin}
                    layout="vertical"
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend {...defaultLegendProps} />
                    {renderDashboardCriteriaBars(t, chartColors, validComparisonData)}
                </BarChart>
            </BaseChartComponent>

            <table className="data-table">
                <thead>
                <tr>
                    <th>{t('criterion', 'tableHeaders')}</th>
                    <th>{t('aiAverage', 'tableHeaders')}</th>
                    <th>{t('humanAverage', 'tableHeaders')}</th>
                    <th>{t('avgDifference', 'tableHeaders')}</th>
                    <th>{t('validComparisons', 'tableHeaders') || 'Valid Comparisons'}</th>
                    <th>{t('totalWorks', 'tableHeaders') || 'Total Works'}</th>
                </tr>
                </thead>
                <tbody>
                {validComparisonData.map((item, index) => (
                    <tr key={item.key} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                        <td>{item.name}</td>
                        <td className="score-cell">
                            <span className="score-value ai-score">{formatValue(item.ai)}%</span>
                        </td>
                        <td className="score-cell">
                            <span className="score-value human-score">{formatValue(item.human)}%</span>
                        </td>
                        <td className="score-cell">
                            <span
                                className="score-value difference-value"
                                style={{ color: getDifferenceColor(item.diff, chartColors) }}
                            >
                                {formatValue(item.diff)}%
                            </span>
                        </td>
                        <td>{item.validComparisons}</td>
                        <td>{item.count}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );

    const renderWeightingDisagreementsTab = () => (
        <div>
            <div className="interpretation-box">
                <div className="interpretation-content">
                    {t('weightingDisagreementsDescription', 'dashboard') ||
                        'This shows criteria where evaluators disagreed on relevance - one assigned weight > 0% while the other assigned 0%.'}
                </div>
            </div>

            <BaseChartComponent height={chartDimensions.height * 2}>
                <BarChart
                    data={weightingDisagreementData}
                    margin={commonChartConfig.margin}
                    layout="vertical"
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend {...defaultLegendProps} />
                    <Bar dataKey="aiOnlyPercentage" name={t('aiOnlyWeighted', 'metrics')} fill={chartColors.PRIMARY} />
                    <Bar dataKey="humanOnlyPercentage" name={t('humanOnlyWeighted', 'metrics')} fill={chartColors.SECONDARY} />
                </BarChart>
            </BaseChartComponent>

            <table className="data-table">
                <thead>
                <tr>
                    <th>{t('criterion', 'tableHeaders')}</th>
                    <th>{t('aiOnlyWeighted', 'metrics')}</th>
                    <th>{t('humanOnlyWeighted', 'metrics')}</th>
                    <th>{t('disagreementRate', 'dashboard') || 'Disagreement Rate'}</th>
                    <th>{t('totalWorks', 'tableHeaders')}</th>
                </tr>
                </thead>
                <tbody>
                {weightingDisagreementData.map((item, index) => (
                    <tr key={item.key} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                        <td>{item.name}</td>
                        <td className="score-cell">{formatValue(item.aiOnlyPercentage)}%</td>
                        <td className="score-cell">{formatValue(item.humanOnlyPercentage)}%</td>
                        <td className="score-cell">
                            <span style={{ color: getDifferenceColor(item.disagreementRate, chartColors, { high: 50, medium: 25 }) }}>
                                {formatValue(item.disagreementRate)}%
                            </span>
                        </td>
                        <td>{item.totalWorks}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );

    const renderZeroWeightAnalysisTab = () => (
        <div>
            <div className="interpretation-box">
                <div className="interpretation-content">
                    {t('zeroWeightAnalysisDescription', 'dashboard') ||
                        'This shows how often criteria were deemed completely irrelevant (0% weight by both evaluators) and overall relevance rates.'}
                </div>
            </div>

            <BaseChartComponent height={chartDimensions.height * 2}>
                <BarChart
                    data={zeroWeightData}
                    margin={commonChartConfig.margin}
                    layout="vertical"
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend {...defaultLegendProps} />
                    <Bar dataKey="relevancePercentage" name={t('relevanceRate', 'dashboard') || 'Relevance Rate'} fill={chartColors.OPTIMAL} />
                    <Bar dataKey="zeroWeightPercentage" name={t('bothIgnoredRate', 'dashboard') || 'Both Ignored Rate'} fill={chartColors.CRITICAL} />
                </BarChart>
            </BaseChartComponent>

            <table className="data-table">
                <thead>
                <tr>
                    <th>{t('criterion', 'tableHeaders')}</th>
                    <th>{t('relevanceRate', 'dashboard') || 'Relevance Rate'}</th>
                    <th>{t('bothIgnoredRate', 'dashboard') || 'Both Ignored Rate'}</th>
                    <th>{t('validComparisons', 'tableHeaders')}</th>
                    <th>{t('totalWorks', 'tableHeaders')}</th>
                </tr>
                </thead>
                <tbody>
                {zeroWeightData.map((item, index) => (
                    <tr key={item.key} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                        <td>{item.name}</td>
                        <td className="score-cell">
                            <span style={{ color: chartColors.OPTIMAL }}>
                                {formatValue(item.relevancePercentage)}%
                            </span>
                        </td>
                        <td className="score-cell">
                            <span style={{ color: chartColors.CRITICAL }}>
                                {formatValue(item.zeroWeightPercentage)}%
                            </span>
                        </td>
                        <td>{item.validComparisons}</td>
                        <td>{item.totalWorks}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="component-container">

            <h4 className="subtitle">{t('enhancedCriteriaAnalysis', 'dashboard') || 'Enhanced Criteria Analysis'}</h4>

            {/* Summary Statistics */}
            <div className="component-grid grid-4-cols">
                <div className="info-box">
                    <div className="data-value">{enhancedMetrics.summary.totalCriteria}</div>
                    <div className="data-label">{t('totalCriteria', 'dashboard') || 'Total Criteria'}</div>
                </div>
                <div className="info-box">
                    <div className="data-value">{formatValue(enhancedMetrics.summary.avgValidComparisons)}</div>
                    <div className="data-label">{t('avgValidComparisons', 'dashboard') || 'Avg Valid Comparisons'}</div>
                </div>
                <div className="info-box">
                    <div className="data-value">{enhancedMetrics.summary.criteriaWithDisagreements}</div>
                    <div className="data-label">{t('criteriaWithDisagreements', 'dashboard') || 'Criteria with Disagreements'}</div>
                </div>
                <div className="info-box">
                    <div className="data-value">{enhancedMetrics.summary.criteriaOftenIgnored}</div>
                    <div className="data-label">{t('criteriaOftenIgnored', 'dashboard') || 'Often Ignored Criteria'}</div>
                </div>
            </div>

            <TabNavigation
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                tabs={tabs}
            />

            <TabContent activeTab={activeTab} tabKey={CRITERIA_TABS.VALID_COMPARISONS}>
                {renderValidComparisonsTab()}
            </TabContent>

            <TabContent activeTab={activeTab} tabKey={CRITERIA_TABS.WEIGHTING_DISAGREEMENTS}>
                {renderWeightingDisagreementsTab()}
            </TabContent>

            <TabContent activeTab={activeTab} tabKey={CRITERIA_TABS.ZERO_WEIGHT_ANALYSIS}>
                {renderZeroWeightAnalysisTab()}
            </TabContent>
        </div>
    );
};

export default CriteriaComparisonComponent;