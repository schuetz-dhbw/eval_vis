import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import BaseChartComponent from '../charts/BaseChartComponent';
import useChart from '../../hooks/useChart';
import { CHART_TYPES, ANALYSIS_TYPES } from '../../constants/chartConstants';

const WeightingAdaptationComponent = ({ works }) => {
    const {
        t,
        chartColors,
        formatValue
    } = useChart({
        analysisType: ANALYSIS_TYPES.DASHBOARD,
        chartType: CHART_TYPES.PIE
    });

    // Calculate weighting adaptation
    const adaptationData = useMemo(() => {
        if (!works || works.length === 0) return null;

        let aiAdapted = 0;
        let humanAdapted = 0;
        const totalWorks = works.length;

        // Standard weights as defined in your project
        const standardWeights = [0.15, 0.1, 0.15, 0.05, 0.05, 0.05, 0.05, 0.1, 0.1, 0.1, 0.1];

        works.forEach(work => {
            // Check if AI adapted weights (deviated from standard weighting)
            const aiUsesStandardWeights = work.aiWeights.every((weight, index) =>
                Math.abs(weight - standardWeights[index]) < 0.01 // Small tolerance for floating point
            );
            if (!aiUsesStandardWeights) {
                aiAdapted++;
            }

            // Check if Human adapted weights (deviated from standard weighting)
            const humanUsesStandardWeights = work.humanWeights.every((weight, index) =>
                Math.abs(weight - standardWeights[index]) < 0.01
            );
            if (!humanUsesStandardWeights) {
                humanAdapted++;
            }
        });

        const aiAdaptedPercentage = (aiAdapted / totalWorks) * 100;
        const humanAdaptedPercentage = (humanAdapted / totalWorks) * 100;

        const aiData = [
            {
                name: t('adapted', 'dashboard') || 'Adapted',
                value: aiAdaptedPercentage,
                count: aiAdapted,
                color: chartColors.QUATERNARY
            },
            {
                name: t('standardWeights', 'dashboard') || 'Standard Weights',
                value: 100 - aiAdaptedPercentage,
                count: totalWorks - aiAdapted,
                color: chartColors.QUINARY
            }
        ];

        const humanData = [
            {
                name: t('adapted', 'dashboard') || 'Adapted',
                value: humanAdaptedPercentage,
                count: humanAdapted,
                color: chartColors.QUATERNARY
            },
            {
                name: t('standardWeights', 'dashboard') || 'Standard Weights',
                value: 100 - humanAdaptedPercentage,
                count: totalWorks - humanAdapted,
                color: chartColors.QUINARY
            }
        ];

        return {
            aiData,
            humanData,
            summary: {
                aiAdapted,
                humanAdapted,
                totalWorks,
                aiAdaptedPercentage,
                humanAdaptedPercentage
            }
        };
    }, [works, chartColors, t]);

    if (!adaptationData) {
        return <div className="no-data-message">{t('noDataAvailable', 'errors')}</div>;
    }

    // Custom tooltip
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="custom-tooltip">
                    <p className="tooltip-title">{data.name}</p>
                    <p className="tooltip-item">
                        <span className="tooltip-label">{t('count', 'tableHeaders')}: </span>
                        <span className="tooltip-value">{data.count}</span>
                    </p>
                    <p className="tooltip-item">
                        <span className="tooltip-label">{t('percentage', 'dashboard')}: </span>
                        <span className="tooltip-value">{data.value.toFixed(1)}%</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="component-container">
            <h4 className="subtitle">{t('weightingAdaptation', 'dashboard') || 'Weighting Adaptation Analysis'}</h4>

            {/* Summary Statistics */}
            <div className="component-grid grid-2-cols" style={{ marginBottom: 'var(--space-lg)' }}>
                <div className="info-box">
                    <div className="data-label">{t('ai', 'labels')} {t('weightingAdaptation', 'dashboard')}</div>
                    <div className="data-value" style={{ color: chartColors.PRIMARY }}>
                        {adaptationData.summary.aiAdapted}
                    </div>
                    <div className="item-description">
                        {formatValue(adaptationData.summary.aiAdaptedPercentage)}% {t('adaptedWeights', 'dashboard') || 'adapted weights'}
                    </div>
                </div>
                <div className="info-box">
                    <div className="data-label">{t('human', 'labels')} {t('weightingAdaptation', 'dashboard')}</div>
                    <div className="data-value" style={{ color: chartColors.SECONDARY }}>
                        {adaptationData.summary.humanAdapted}
                    </div>
                    <div className="item-description">
                        {formatValue(adaptationData.summary.humanAdaptedPercentage)}% {t('adaptedWeights', 'dashboard') || 'adapted weights'}
                    </div>
                </div>
            </div>

            {/* Side-by-side Pie Charts */}
            <div className="component-grid grid-2-cols">
                {/* AI Pie Chart */}
                <div>
                    <h5 className="subtitle">{t('ai', 'labels')} {t('weightingStrategy', 'dashboard') || 'Weighting Strategy'}</h5>
                    <BaseChartComponent height={300}>
                        <PieChart>
                            <Pie
                                data={adaptationData.aiData}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                dataKey="value"
                                label={({ value }) => `${value.toFixed(1)}%`}
                            >
                                {adaptationData.aiData.map((entry, index) => (
                                    <Cell key={`ai-cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                        </PieChart>
                    </BaseChartComponent>
                </div>

                {/* Human Pie Chart */}
                <div>
                    <h5 className="subtitle">{t('human', 'labels')} {t('weightingStrategy', 'dashboard') || 'Weighting Strategy'}</h5>
                    <BaseChartComponent height={300}>
                        <PieChart>
                            <Pie
                                data={adaptationData.humanData}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                dataKey="value"
                                label={({ value }) => `${value.toFixed(1)}%`}
                            >
                                {adaptationData.humanData.map((entry, index) => (
                                    <Cell key={`human-cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                        </PieChart>
                    </BaseChartComponent>
                </div>
            </div>

            {/* Analysis Text */}
            <div className="interpretation-box">
                <div className="interpretation-content">
                    {t('weightingAdaptationDescription', 'dashboard') ||
                        `Analysis shows contrasting weighting strategies: Human evaluators adapted weights in ${formatValue(adaptationData.summary.humanAdaptedPercentage)}% of evaluations, while AI used adapted weights in only ${formatValue(adaptationData.summary.aiAdaptedPercentage)}% of cases, suggesting different approaches to criterion prioritization.`}
                </div>
            </div>
        </div>
    );
};

export default React.memo(WeightingAdaptationComponent);