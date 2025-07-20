import React, { useMemo } from 'react';
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, Cell } from 'recharts';
import { calculateMean } from '../../utils/dataUtils';
import { getDifferenceColor } from '../../utils/chartUtils';
import BaseChartComponent from '../charts/BaseChartComponent';
import useChart from '../../hooks/useChart';
import { CHART_TYPES, ANALYSIS_TYPES } from '../../constants/chartConstants';
import {CRITERIA_SECTIONS} from "../../constants/criteriaConstants";

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

    // Berechne die durchschnittlichen Differenzen pro Bereich
    const sectionData = useMemo(() => {
        // Sicherheitscheck
        if (!works || works.length === 0) return [];

        const sectionStats = {};

        // Initialisiere Datenstruktur für jede Sektion
        Object.keys(CRITERIA_SECTIONS).forEach(sectionKey => {
            sectionStats[sectionKey] = {
                aiScores: [],
                humanScores: [],
                differences: [],
                criteriaCount: 0
            };
        });

        // Sammle Daten für jede Arbeit und jedes Kriterium
        works.forEach(work => {
            if (!work.criteriaKeys || !work.aiScores || !work.humanScores) return;

            // Validiere dass alle Arrays dieselbe Länge haben
            const minLength = Math.min(
                work.criteriaKeys.length,
                work.aiScores.length,
                work.humanScores.length
            );

            for (let index = 0; index < minLength; index++) {
                const key = work.criteriaKeys[index];
                const aiScore = work.aiScores[index];
                const humanScore = work.humanScores[index];

                // Überspringe ungültige Werte
                if (aiScore == null || humanScore == null || isNaN(aiScore) || isNaN(humanScore)) {
                    continue;
                }

                // Finde die Sektion für dieses Kriterium
                const sectionKey = Object.keys(CRITERIA_SECTIONS).find(section =>
                    CRITERIA_SECTIONS[section].includes(key)
                );

                if (sectionKey && sectionStats[sectionKey]) {
                    sectionStats[sectionKey].aiScores.push(Number(aiScore));
                    sectionStats[sectionKey].humanScores.push(Number(humanScore));
                    sectionStats[sectionKey].differences.push(
                        Math.abs(Number(aiScore) - Number(humanScore))
                    );
                    sectionStats[sectionKey].criteriaCount++;
                }
            }
        });

        // Berechne Durchschnittswerte für die Visualisierung
        return Object.keys(sectionStats)
            .filter(sectionKey => sectionStats[sectionKey].aiScores.length > 0)
            .map(sectionKey => {
                const stats = sectionStats[sectionKey];
                return {
                    key: sectionKey,
                    name: t(sectionKey, 'criteriaSection'),
                    ai: calculateMean(stats.aiScores),
                    human: calculateMean(stats.humanScores),
                    diff: calculateMean(stats.differences),
                    count: stats.aiScores.length,
                    criteriaInSection: CRITERIA_SECTIONS[sectionKey].length,
                    // Zusätzliche Statistiken
                    aiMin: Math.min(...stats.aiScores),
                    aiMax: Math.max(...stats.aiScores),
                    humanMin: Math.min(...stats.humanScores),
                    humanMax: Math.max(...stats.humanScores)
                };
            })
            .sort((a, b) => b.diff - a.diff); // Sortiere nach größter Differenz
    }, [works, t]);

    // Wenn keine Daten, zeige eine Nachricht
    if (!sectionData || sectionData.length === 0) {
        return <div className="no-data-message">{t('noDataAvailable', 'errors')}</div>;
    }

    const maxDiff = Math.max(...sectionData.map(item => item.diff));

    return (
        <div className="component-container">
        <BaseChartComponent height={chartDimensions.height * 1.5}>
            <BarChart
                data={sectionData}
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
                    {sectionData.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={getDifferenceColor(entry.diff, chartColors, { high: 25, medium: 15 })}
                        />
                    ))}
                </Bar>
            </BarChart>
        </BaseChartComponent>
            <h4 className="subtitle">{t('criteriaSectionComparison', 'dashboard')}</h4>

            <table className="data-table criteria-section-table">
                <thead>
                <tr>
                    <th>{t('section', 'tableHeaders')}</th>
                    <th>{t('aiAverage', 'tableHeaders')}</th>
                    <th>{t('humanAverage', 'tableHeaders')}</th>
                    <th>{t('avgDifference', 'tableHeaders')}</th>
                    <th>{t('evaluations', 'tableHeaders')}</th>
                    <th>{t('aiRange', 'tableHeaders')}</th>
                    <th>{t('humanRange', 'tableHeaders')}</th>
                    <th>{t('visualization', 'dashboard')}</th>
                </tr>
                </thead>
                <tbody>
                {sectionData.map((item, index) => {
                    const diffColor = getDifferenceColor(item.diff, chartColors, { high: 25, medium: 15 });
                    const barWidth = (item.diff / maxDiff) * 100;

                    return (
                        <tr key={item.key} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                            <td className="section-name">
                                <div className="section-info">
                                    <div className="section-title">{item.name}</div>
                                    <div className="section-subtitle">
                                        {item.criteriaInSection} {t('criteria', 'labels')}
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
                            <td className="count-cell">{item.count}</td>
                            <td className="range-cell">
                                {formatValue(item.aiMin)}% - {formatValue(item.aiMax)}%
                            </td>
                            <td className="range-cell">
                                {formatValue(item.humanMin)}% - {formatValue(item.humanMax)}%
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
        </div>
    );
};

export default CriteriaSectionComparisonComponent;