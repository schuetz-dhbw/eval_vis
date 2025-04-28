import React, { memo, useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell
} from 'recharts';
import { CHART_MARGINS, AXIS_CONFIG, getChartColors } from '../../constants/chartConfig';
import { useTranslation } from '../../hooks/useTranslation';
import CustomTooltip from './CustomTooltip';
import BaseChartComponent from './BaseChartComponent';
import './styles/workTypeAnalysis.css';

const WorkTypeAnalysisComponent = memo (({ works }) => {

    const t = useTranslation();
    const CHART_COLORS = getChartColors();

    // Group works by type
    const groupedWorks = useMemo(() => {
        const result = {};
        works.forEach(work => {
            if (!result[work.typeKey]) {
                result[work.typeKey] = [];
            }
            result[work.typeKey].push(work);
        });
        return result;
    }, [works]);

    // Calculate average differences by criteria for each type
    const differencesByType = useMemo(() => {
        const result = [];

        Object.entries(groupedWorks).forEach(([typeKey, typeWorks]) => {
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
                            type: typeKey,  // Speichere hier den typeKey statt der Übersetzung
                            criterion: typeWorks[0].criteriaKeys[i],
                            averageDifference: totalDiff / validWorkCount,
                            count: validWorkCount
                        });
                    }
                }
            }
        });

        return result;
    }, [groupedWorks]);


    // Calculate overall average score difference by work type
    const overallDifferenceByType = useMemo(() => {
        const result = [];

        Object.entries(groupedWorks).forEach(([typeKey, typeWorks]) => {
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
                    type: t(typeKey, 'works.types'),
                    typeKey: typeKey,
                    averageDifference: totalDiff / diffCount,
                    count: typeWorks.length
                });
            }
        });

        // Sort by average difference (descending)
        return result.sort((a, b) => b.averageDifference - a.averageDifference);
    }, [groupedWorks, t]);

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

        return Object.entries(resultByType).map(([typeKey, data]) => ({
            type: t(typeKey, 'works.types'),
            criterion: t(data.criterion, 'works.criteriaLabels'),
            averageDifference: data.averageDifference
        }));
    }, [differencesByType, t]);

    // Find the top 5 criteria with the largest differences across all types
    const topCriteriaByDifference = useMemo(() => {
        // Erstelle ein Array mit den Kriterien und den durchschnittlichen Abweichungen
        const topCriteria = differencesByType.map(item => ({
            criterion: t(item.criterion, 'works.criteriaLabels'), // Übersetze den Criterion-Key in ein Label
            type: t(item.type, 'works.types'), // Übersetze den Typ-Key in einen lesbaren Namen (falls benötigt)
            averageDifference: item.averageDifference,
        }));

        // Sortiere die Kriterien nach durchschnittlicher Abweichung (absteigend)
        return topCriteria
            .sort((a, b) => b.averageDifference - a.averageDifference)
            .slice(0, 5);
    }, [differencesByType, t]);


    const tooltipFormatter = useMemo(() => {
        return (data) => {
            return {
                title: data.type,
                items: [
                    {
                        name: t('avgDifference', 'metrics'),
                        value: data.averageDifference.toFixed(2) + "%",
                        className: ""
                    },
                    {
                        name: t('count', 'tableHeaders'),
                        value: data.count,
                        className: ""
                    }
                ]
            };
        };
    }, [t]);

    // Get colors based on difference value
    const getDifferenceColor = useMemo(() => {
        return (value) => {
            if (value > 30) return CHART_COLORS.TERTIARY; // Large difference - orange
            if (value > 15) return CHART_COLORS.PRIMARY; // Medium difference - purple
            return CHART_COLORS.SECONDARY; // Small difference - green
        };
    }, [CHART_COLORS.PRIMARY, CHART_COLORS.SECONDARY, CHART_COLORS.TERTIARY]);

    return (
        <div className="work-type-analysis">
            <div className="flex-column">
                <div className="component-container">
                    <h4 className="section-title">{t('differenceByTypeTitle', 'chartTitles') || "Average Difference by Work Type"}</h4>
                    <div className="chart-wrapper">
                        <BaseChartComponent height={300}>
                            <BarChart
                                data={overallDifferenceByType}
                                margin={CHART_MARGINS.WORK_TYPE_BAR}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="type"
                                    {...AXIS_CONFIG.DEFAULT_X}
                                />
                                <YAxis />
                                <Tooltip content={<CustomTooltip formatter={tooltipFormatter} />} />
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
                        </BaseChartComponent>
                    </div>
                </div>

                <div className="component-container">
                    <h4 className="section-title">{t('criteriaByTypeTitle', 'chartTitles') || "Criteria Differences by Work Type"}</h4>
                    <div className="flex-column">
                        <div className="flex-row">
                            <div className="legend-item">
                                <span className="legend-color" style={{ backgroundColor: CHART_COLORS.SECONDARY }}></span>
                                <span className="legend-text">&lt; 15%</span>
                            </div>
                            <div className="legend-item">
                                <span className="legend-color" style={{ backgroundColor: CHART_COLORS.PRIMARY }}></span>
                                <span className="legend-text">15-30%</span>
                            </div>
                            <div className="legend-item">
                                <span className="legend-color" style={{ backgroundColor: CHART_COLORS.TERTIARY }}></span>
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

                <div className="component-container">
                    <h4 className="subtitle">{t('tableTitle', 'chartTitles')}</h4>
                    <div className="split-layout">
                        <div className="flex-column">
                            <h4 className="subtitle">{t('largestDiffByTypeTitle', 'chartTitles')}</h4>
                            <table className="data-table">
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
                        <div className="flex-column">
                            <h4 className="subtitle">{t('topCriteriaTitle', 'chartTitles')}</h4>
                            <table className="data-table">
                            <thead>
                            <tr>
                                <th>{t('criterion', 'tableHeaders')}</th>
                                <th>{t('avgDifference', 'metrics') || "Avg. Difference"}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {topCriteriaByDifference.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.criterion}</td>
                                    <td>{item.averageDifference.toFixed(2)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default WorkTypeAnalysisComponent;