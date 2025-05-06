import React, { useMemo } from 'react';
import BaseChartComponent from '../charts/BaseChartComponent';
import useChart from '../../hooks/useChart';
import { CHART_TYPES, ANALYSIS_TYPES } from '../../constants/chartConstants';

const ViolinPlotComponent = ({ data }) => {
    const {
        t,
        chartColors
    } = useChart({
        analysisType: ANALYSIS_TYPES.DASHBOARD,
        chartType: CHART_TYPES.VIOLIN
    });

    // Dimensionen
    const width = 1000;
    const height = 300;
    const padding = 40;

    // Memoize Basis-Berechnungen
    const plotConfig = useMemo(() => {
        // Finden der min und max Noten
        const minGrade = data.min;
        const maxGrade = data.max;

        // Position für jede Violin
        const yAI = height / 3;
        const yHuman = (height * 2) / 3;

        return {
            minGrade,
            maxGrade,
            yAI,
            yHuman,
            // Hilfsfunktion für Notenposition auf X-Achse
            gradeToX: (grade) => {
                return padding + (width - 2 * padding) * (grade - minGrade) / (maxGrade - minGrade);
            }
        };
    }, [data.min, data.max, width, height, padding]);

    // Memoize Frequenz-Berechnungen für AI Noten
    const aiFrequencyData = useMemo(() => {
        const groups = {};
        data.aiGrades.forEach(grade => {
            const roundedGrade = Math.round(grade * 10) / 10;
            groups[roundedGrade] = (groups[roundedGrade] || 0) + 1;
        });
        const maxCount = Math.max(...Object.values(groups));

        // Vorberechnete Daten für jeden Punkt
        const pointsPositions = [];
        const pointsCount = {};

        data.aiGrades.forEach((grade, i) => {
            const x = plotConfig.gradeToX(grade);
            const roundedGrade = Math.round(grade * 10) / 10;

            // Zähle, wie oft wir diese Note bereits gesehen haben
            pointsCount[roundedGrade] = (pointsCount[roundedGrade] || 0) + 1;
            const currentCount = pointsCount[roundedGrade];

            // Gesamtzahl für diese Note
            const totalForThisGrade = groups[roundedGrade];

            // Gleichmäßige Verteilung berechnen
            let yOffset = 0;
            if (totalForThisGrade > 1) {
                const maxOffset = (groups[roundedGrade] / maxCount) * 40 / 2 * 0.9;
                yOffset = ((currentCount - 1) / (totalForThisGrade - 1) * 2 - 1) * maxOffset;
            }

            pointsPositions.push({
                key: `ai-${i}`,
                x,
                y: yOffset,
                grade,
                tooltip: `${t('grade', 'labels')}: ${grade.toFixed(1)} (Work ${i+1})`
            });
        });

        return {
            groups,
            maxCount,
            pointsPositions
        };
    }, [data.aiGrades, plotConfig, t]);

    // Memoize Frequenz-Berechnungen für Human Noten
    const humanFrequencyData = useMemo(() => {
        const groups = {};
        data.humanGrades.forEach(grade => {
            const roundedGrade = Math.round(grade * 10) / 10;
            groups[roundedGrade] = (groups[roundedGrade] || 0) + 1;
        });
        const maxCount = Math.max(...Object.values(groups));

        // Vorberechnete Daten für jeden Punkt
        const pointsPositions = [];
        const pointsCount = {};

        data.humanGrades.forEach((grade, i) => {
            const x = plotConfig.gradeToX(grade);
            const roundedGrade = Math.round(grade * 10) / 10;

            // Zähle, wie oft wir diese Note bereits gesehen haben
            pointsCount[roundedGrade] = (pointsCount[roundedGrade] || 0) + 1;
            const currentCount = pointsCount[roundedGrade];

            // Gesamtzahl für diese Note
            const totalForThisGrade = groups[roundedGrade];

            // Gleichmäßige Verteilung berechnen
            let yOffset = 0;
            if (totalForThisGrade > 1) {
                const maxOffset = (groups[roundedGrade] / maxCount) * 40 / 2 * 0.9;
                yOffset = ((currentCount - 1) / (totalForThisGrade - 1) * 2 - 1) * maxOffset;
            }

            pointsPositions.push({
                key: `human-${i}`,
                x,
                y: yOffset,
                grade,
                tooltip: `${t('grade', 'labels')}: ${grade.toFixed(1)} (Work ${i+1})`
            });
        });

        return {
            groups,
            maxCount,
            pointsPositions
        };
    }, [data.humanGrades, plotConfig, t]);

    // Memoize Achsen-Ticks für X-Achse
    const xAxisTicks = useMemo(() => {
        return Array.from({ length: Math.round((plotConfig.maxGrade - plotConfig.minGrade) * 10) + 1 }, (_, i) => {
            const grade = plotConfig.minGrade + i / 10;
            const isFullGrade = Math.abs(Math.round(grade) - grade) < 0.05;
            const isHalfGrade = Math.abs(grade - Math.floor(grade) - 0.5) < 0.05;

            return {
                grade,
                isFullGrade,
                isHalfGrade,
                x: plotConfig.gradeToX(grade)
            };
        });
    }, [plotConfig]);

    return (
        <BaseChartComponent height={height}>
            <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
                {/* X-Achse (Noten) - horizontal unten */}
                <line x1={padding} y1={height-padding} x2={width-padding} y2={height-padding}
                      stroke="currentColor" strokeWidth="1" />

                {/* Y-Achse - vertikal links */}
                <line x1={padding} y1={padding} x2={padding} y2={height-padding}
                      stroke="currentColor" strokeWidth="1" />

                {/* X-Achsen-Beschriftungen (Noten) - aus memoized xAxisTicks */}
                {xAxisTicks.map((tick, idx) => (
                    <React.Fragment key={idx}>
                        {tick.isFullGrade ? (
                            <>
                                <text
                                    x={tick.x}
                                    y={height-padding+15}
                                    textAnchor="middle"
                                    fontSize="11"
                                    fill="currentColor"
                                >
                                    {Math.round(tick.grade)}
                                </text>
                                <line
                                    x1={tick.x}
                                    y1={height-padding}
                                    x2={tick.x}
                                    y2={height-padding+5}
                                    stroke="currentColor"
                                    strokeWidth="1"
                                />
                            </>
                        ) : (
                            <line
                                x1={tick.x}
                                y1={height-padding}
                                x2={tick.x}
                                y2={height-padding+2}
                                stroke="currentColor"
                                strokeWidth="0.5"
                            />
                        )}

                        {tick.isHalfGrade && (
                            <text
                                x={tick.x}
                                y={height-padding+12}
                                textAnchor="middle"
                                fontSize="8"
                                fill="currentColor"
                            >
                                {tick.grade.toFixed(1)}
                            </text>
                        )}
                    </React.Fragment>
                ))}

                {/* X-Achsenbeschriftung */}
                <text x={width/2} y={height-5} textAnchor="middle" fontSize="10" fill="currentColor">
                    {t('grade', 'labels')}
                </text>

                {/* AI Violin */}
                <g transform={`translate(0, ${plotConfig.yAI})`}>
                    {/* Violin-Form basierend auf tatsächlichen Punkten */}
                    {Object.entries(aiFrequencyData.groups).map(([grade, count], i) => {
                        const x = plotConfig.gradeToX(parseFloat(grade));
                        const height = (count / aiFrequencyData.maxCount) * 40;

                        return (
                            <rect key={i}
                                  x={x-2}
                                  y={-height/2}
                                  width={4}
                                  height={height}
                                  fill={chartColors.PRIMARY}
                                  fillOpacity="0.3"
                            />
                        );
                    })}

                    {/* Scatter-Punkte an der exakten Position - aus memoized pointsPositions */}
                    {aiFrequencyData.pointsPositions.map((point) => (
                        <circle
                            key={point.key}
                            cx={point.x}
                            cy={point.y}
                            r="2"
                            fill={chartColors.PRIMARY}
                            stroke="white"
                            strokeWidth="0.5"
                        >
                            <title>{point.tooltip}</title>
                        </circle>
                    ))}

                    <text x={padding-25} y="0" textAnchor="end" dominantBaseline="middle" fontSize="10" fill={chartColors.PRIMARY}>
                        {t('ai', 'labels')}
                    </text>
                </g>

                {/* Human Violin */}
                <g transform={`translate(0, ${plotConfig.yHuman})`}>
                    {/* Violin-Form basierend auf tatsächlichen Punkten */}
                    {Object.entries(humanFrequencyData.groups).map(([grade, count], i) => {
                        const x = plotConfig.gradeToX(parseFloat(grade));
                        const height = (count / humanFrequencyData.maxCount) * 40;

                        return (
                            <rect key={i}
                                  x={x-2}
                                  y={-height/2}
                                  width={4}
                                  height={height}
                                  fill={chartColors.SECONDARY}
                                  fillOpacity="0.3"
                            />
                        );
                    })}

                    {/* Scatter-Punkte an der exakten Position - aus memoized pointsPositions */}
                    {humanFrequencyData.pointsPositions.map((point) => (
                        <circle
                            key={point.key}
                            cx={point.x}
                            cy={point.y}
                            r="2"
                            fill={chartColors.SECONDARY}
                            stroke="white"
                            strokeWidth="0.5"
                        >
                            <title>{point.tooltip}</title>
                        </circle>
                    ))}

                    <text x={padding-25} y="0" textAnchor="end" dominantBaseline="middle" fontSize="10" fill={chartColors.SECONDARY}>
                        {t('human', 'labels')}
                    </text>
                </g>
            </svg>
        </BaseChartComponent>
    );
};

export default React.memo(ViolinPlotComponent);