import React, { useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { CHART_MARGINS, AXIS_CONFIG, getChartColors } from '../../constants/chartConfig';
import { useTranslation } from '../../hooks/useTranslation';
import './styles/workTypeAnalysis.css';

const WorkTypeAnalysisComponent = ({ works, language }) => {
    const t = useTranslation(language);
    const CHART_COLORS = getChartColors();

    // Group works by type
        const groupedWorks = useMemo(() => {
            const result = {};
            works.forEach(work => {
                if (!result[work.type]) {
                    result[work.type] = [];
                }
                result[work.type].push(work);
            });
            return result;
        }, [works]);

    // Calculate average differences by criteria for each type
    const differencesByType = useMemo(() => {
        const result = [];

        Object.entries(groupedWorks).forEach(([type, typeWorks]) => {
            // For each criterion, calculate the average difference
            if (typeWorks.length > 0) {
                const criteriaCount = typeWorks[0].criteriaKeys.length;

                for (let i = 0; i < criteriaCount; i++) {
                    let totalDiff = 0;
                    let validWorkCount = 0;

                    typeWorks.forEach(work => {
                        const diff = Math.abs(work.aiScores[i] - work.humanScores[i]);
                        if (!isNaN(diff)) {
                            totalDiff += diff;
                            validWorkCount++;
                        }
                    });

                    if (validWorkCount > 0) {
                        result.push({
                            type,
                            criterion: typeWorks[0].criteriaKeys[i],
                            averageDifference: totalDiff / validWorkCount,
                            count: validWorkCount
                        });
                    }
                }
            }
        }, [groupedWorks]);

        return result;
    }, [groupedWorks]);

    // Calculate overall average score difference by work type
    const overallDifferenceByType = useMemo(() => {
        const result = [];

        Object.entries(groupedWorks).forEach(([type, typeWorks]) => {
            let totalDiff = 0;
            let diffCount = 0;

            typeWorks.forEach(work => {
                for (let i = 0; i < work.aiScores.length; i++) {
                    const diff = Math.abs(work.aiScores[i] - work.humanScores[i]);
                    if (!isNaN(diff)) {
                        totalDiff += diff;
                        diffCount++;
                    }
                }
            });

            if (diffCount > 0) {
                result.push({
                    type,
                    averageDifference: totalDiff / diffCount,
                    count: typeWorks.length
                });
            }
        });

        // Sort by average difference (descending)
        return result.sort((a, b) => b.averageDifference - a.averageDifference);
    }, [groupedWorks]);

    // Find the criteria with the largest average difference for each type
    const largestDifferencesByType = useMemo(() => {
        const resultByType = {};

        differencesByType.forEach(item => {
            if (!resultByType[item.type] || item.averageDifference > resultByType[item.type].averageDifference) {
                resultByType[item.type] = {
                    criterion: item.criterion,
                    averageDifference: item.averageDifference
                };
            }
        });

        return Object.entries(resultByType).map(([type, data]) => ({
            type,
            criterion: data.criterion,
            averageDifference: data.averageDifference
        }));
    }, [differencesByType]);

    // Find the top 5 criteria with the largest differences across all types
    const topCriteriaByDifference = useMemo(() => {
        const criteriaMap = {};

        differencesByType.forEach(item => {
            if (!criteriaMap[item.criterion]) {
                criteriaMap[item.criterion] = {
                    criterion: item.criterion,
                    totalDifference: 0,
                    count: 0
                };
            }

            criteriaMap[item.criterion].totalDifference += item.averageDifference;
            criteriaMap[item.criterion].count++;
        });

        const result = Object.values(criteriaMap).map(item => ({
            ...item,
            averageDifference: item.totalDifference / item.count
        }));

        // Sort by average difference (descending) and take top 5
        return result
            .sort((a, b) => b.averageDifference - a.averageDifference)
            .slice(0, 5);
    }, [differencesByType]);

    // Custom tooltip for the bar chart
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="custom-tooltip">
                    <p className="tooltip-title">{data.type}</p>
                    <p className="tooltip-item">
                        <span className="tooltip-label">{t('avgDifference', 'metrics') || "Average Difference"}:</span>
                        <span className="tooltip-value">{data.averageDifference.toFixed(2)}%</span>
                    </p>
                    <p className="tooltip-item">
                        <span className="tooltip-label">{t('count', 'metrics') || "Count"}:</span>
                        <span className="tooltip-value">{data.count}</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    // Create scatter data for work types vs criteria differences
    const scatterData = useMemo(() => {
        return differencesByType.map((item, index) => ({
            x: item.type,
            y: item.criterion,
            z: item.averageDifference,
            count: item.count,
            id: index
        }));
    }, [differencesByType]);

    // Get colors based on difference value
    const getDifferenceColor = (value) => {
        if (value > 30) return CHART_COLORS.TERTIARY; // Large difference - orange
        if (value > 15) return CHART_COLORS.PRIMARY; // Medium difference - purple
        return CHART_COLORS.SECONDARY; // Small difference - green
    };

    return (
        <div className="work-type-analysis">
            <h3 className="section-title">{t('workTypeAnalysisTitle', 'chartTitles') || "Work Type Analysis"}</h3>

            <div className="analysis-content">
                <div className="chart-container">
                    <h4 className="chart-subtitle">{t('differenceByTypeTitle', 'chartTitles') || "Average Difference by Work Type"}</h4>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={overallDifferenceByType}
                                margin={CHART_MARGINS.WORK_TYPE_BAR}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="type"
                                    {...AXIS_CONFIG.WORK_TYPE_X}
                                />
                                <YAxis
                                    label={{
                                        value: t('avgDifference', 'metrics') || "Average Difference (%)",
                                        angle: -90,
                                        position: 'insideLeft'
                                    }}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Bar
                                    dataKey="averageDifference"
                                    name={t('avgDifference', 'metrics') || "Average Difference"}
                                    fill={CHART_COLORS.PRIMARY}
                                >
                                    {overallDifferenceByType.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={getDifferenceColor(entry.averageDifference)}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="matrix-container">
                    <h4 className="chart-subtitle">{t('criteriaByTypeTitle', 'chartTitles') || "Criteria Differences by Work Type"}</h4>
                    <div className="heatmap-wrapper">
                        <div className="heatmap-legend">
                            <div className="legend-item">
                                <span className="legend-color" style={{ backgroundColor: '#82ca9d' }}></span>
                                <span className="legend-text">&lt; 15%</span>
                            </div>
                            <div className="legend-item">
                                <span className="legend-color" style={{ backgroundColor: '#8884d8' }}></span>
                                <span className="legend-text">15-30%</span>
                            </div>
                            <div className="legend-item">
                                <span className="legend-color" style={{ backgroundColor: '#ff7300' }}></span>
                                <span className="legend-text">&gt; 30%</span>
                            </div>
                        </div>

                        <div className="heatmap-grid">
                            {differencesByType.map((item, index) => (
                                <div
                                    key={index}
                                    className="heatmap-cell"
                                    style={{
                                        backgroundColor: getDifferenceColor(item.averageDifference),
                                        opacity: 0.7 + (item.averageDifference / 100 * 0.3) // Adjust opacity based on value
                                    }}
                                    title={`${item.type} - ${item.criterion}: ${item.averageDifference.toFixed(1)}%`}
                                >
                                    {item.averageDifference.toFixed(0)}%
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="tables-container">
                    <div className="table-section">
                        <h4 className="chart-subtitle">{t('largestDiffByTypeTitle', 'chartTitles') || "Largest Difference by Work Type"}</h4>
                        <table className="analysis-table">
                            <thead>
                            <tr>
                                <th>{t('workType', 'tableHeaders') || "Work Type"}</th>
                                <th>{t('criterion', 'tableHeaders')}</th>
                                <th>{t('avgDifference', 'metrics') || "Avg. Difference"}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {largestDifferencesByType.map((item, index) => (
                                <tr key={index} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                                    <td>{item.type}</td>
                                    <td>{item.criterion}</td>
                                    <td>{item.averageDifference.toFixed(2)}%</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="table-section">
                        <h4 className="chart-subtitle">{t('topCriteriaTitle', 'chartTitles') || "Top 5 Criteria by Difference"}</h4>
                        <table className="analysis-table">
                            <thead>
                            <tr>
                                <th>{t('criterion', 'tableHeaders')}</th>
                                <th>{t('avgDifference', 'metrics') || "Avg. Difference"}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {topCriteriaByDifference.map((item, index) => (
                                <tr key={index} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                                    <td>{item.criterion}</td>
                                    <td>{item.averageDifference.toFixed(2)}%</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkTypeAnalysisComponent;