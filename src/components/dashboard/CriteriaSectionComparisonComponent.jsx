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
        defaultLegendProps
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
                differences: []
            };
        });

        // Sammle Daten für jede Arbeit und jedes Kriterium
        works.forEach(work => {
            if (!work.criteriaKeys || !work.aiScores || !work.humanScores) return;

            work.criteriaKeys.forEach((key, index) => {
                // Finde die Sektion für dieses Kriterium
                const sectionKey = Object.keys(CRITERIA_SECTIONS).find(section =>
                    CRITERIA_SECTIONS[section].includes(key)
                );

                if (sectionKey && sectionStats[sectionKey]) {
                    sectionStats[sectionKey].aiScores.push(work.aiScores[index]);
                    sectionStats[sectionKey].humanScores.push(work.humanScores[index]);
                    sectionStats[sectionKey].differences.push(
                        Math.abs(work.aiScores[index] - work.humanScores[index])
                    );
                }
            });
        });

        // Berechne Durchschnittswerte für die Visualisierung
        return Object.keys(sectionStats)
            .filter(sectionKey => sectionStats[sectionKey].aiScores.length > 0)
            .map(sectionKey => ({
                key: sectionKey,
                name: t(sectionKey, 'criteriaSection'), // Übersetze über den hook
                ai: calculateMean(sectionStats[sectionKey].aiScores),
                human: calculateMean(sectionStats[sectionKey].humanScores),
                diff: calculateMean(sectionStats[sectionKey].differences),
                count: sectionStats[sectionKey].aiScores.length
            }));
    }, [works, t]);

    // Wenn keine Daten, zeige eine Nachricht
    if (!sectionData || sectionData.length === 0) {
        return <div className="no-data-message">{t('noDataAvailable', 'errors')}</div>;
    }

    return (
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
    );
};

export default CriteriaSectionComparisonComponent;