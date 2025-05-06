// src/components/dashboard/ViolinPlotComponent.jsx - Vollständig überarbeitete Version
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

    // Finden der min und max Noten
    const minGrade = data.min;
    const maxGrade = data.max;

    // Hilfsfunktion für Notenposition auf X-Achse
    const gradeToX = (grade) => {
        return padding + (width - 2 * padding) * (grade - minGrade) / (maxGrade - minGrade);
    };

    // Position für jede Violin
    const yAI = height / 3;
    const yHuman = (height * 2) / 3;

    // Berechne Häufigkeiten der Noten für beide Datensätze
    const aiGradeGroups = useMemo(() => {
        const groups = {};
        data.aiGrades.forEach(grade => {
            const roundedGrade = Math.round(grade * 10) / 10;
            groups[roundedGrade] = (groups[roundedGrade] || 0) + 1;
        });
        return groups;
    }, [data.aiGrades]);

    const humanGradeGroups = useMemo(() => {
        const groups = {};
        data.humanGrades.forEach(grade => {
            const roundedGrade = Math.round(grade * 10) / 10;
            groups[roundedGrade] = (groups[roundedGrade] || 0) + 1;
        });
        return groups;
    }, [data.humanGrades]);

    // Maximale Anzahl für die Normalisierung
    const aiMaxCount = Math.max(...Object.values(aiGradeGroups));
    const humanMaxCount = Math.max(...Object.values(humanGradeGroups));

    return (
        <BaseChartComponent height={height}>
            <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
                {/* X-Achse (Noten) - horizontal unten */}
                <line x1={padding} y1={height-padding} x2={width-padding} y2={height-padding}
                      stroke="currentColor" strokeWidth="1" />

                {/* Y-Achse - vertikal links */}
                <line x1={padding} y1={padding} x2={padding} y2={height-padding}
                      stroke="currentColor" strokeWidth="1" />

                {/* X-Achsen-Beschriftungen (Noten) in 0.1 Schritten */}
                {Array.from({ length: Math.round((maxGrade - minGrade) * 10) + 1 }, (_, i) => {
                    const grade = minGrade + i / 10;
                    const isFullGrade = Math.abs(Math.round(grade) - grade) < 0.05;

                    return (
                        <React.Fragment key={i}>
                            {/* Vollständige Noten werden größer und mit Textbeschriftung dargestellt */}
                            {isFullGrade ? (
                                <>
                                    <text
                                        x={gradeToX(grade)}
                                        y={height-padding+15}
                                        textAnchor="middle"
                                        fontSize="11"
                                        fill="currentColor"
                                    >
                                        {Math.round(grade)}
                                    </text>
                                    <line
                                        x1={gradeToX(grade)}
                                        y1={height-padding}
                                        x2={gradeToX(grade)}
                                        y2={height-padding+5}
                                        stroke="currentColor"
                                        strokeWidth="1"
                                    />
                                </>
                            ) : (
                                // Zehntelschritte werden als kleinere Striche dargestellt
                                <line
                                    x1={gradeToX(grade)}
                                    y1={height-padding}
                                    x2={gradeToX(grade)}
                                    y2={height-padding+2}
                                    stroke="currentColor"
                                    strokeWidth="0.5"
                                />
                            )}

                            {/* Bei x.5-Werten kleine Beschriftung hinzufügen */}
                            {Math.abs(grade - Math.floor(grade) - 0.5) < 0.05 && (
                                <text
                                    x={gradeToX(grade)}
                                    y={height-padding+12}
                                    textAnchor="middle"
                                    fontSize="8"
                                    fill="currentColor"
                                >
                                    {grade.toFixed(1)}
                                </text>
                            )}
                        </React.Fragment>
                    );
                })}

                {/* X-Achsenbeschriftung */}
                <text x={width/2} y={height-5} textAnchor="middle" fontSize="10" fill="currentColor">
                    {t('grade', 'labels')}
                </text>

                {/* AI Violin */}
                <g transform={`translate(0, ${yAI})`}>
                    {/* Violin-Form basierend auf tatsächlichen Punkten */}
                    {Object.entries(aiGradeGroups).map(([grade, count], i) => {
                        const x = gradeToX(parseFloat(grade));
                        const height = (count / aiMaxCount) * 40; // Maximale Höhe

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

                    {/* Scatter-Punkte an der exakten Position */}
                    {(() => {
                        const pointsCount = {}; // Zähler für gleichartige Punkte

                        return data.aiGrades.map((grade, i) => {
                            const x = gradeToX(grade);
                            const roundedGrade = Math.round(grade * 10) / 10;

                            // Zähle, wie oft wir diese Note bereits gesehen haben
                            pointsCount[roundedGrade] = (pointsCount[roundedGrade] || 0) + 1;
                            const currentCount = pointsCount[roundedGrade];

                            // Gesamtzahl für diese Note (aus aiGradeGroups)
                            const totalForThisGrade = aiGradeGroups[roundedGrade];

                            // Gleichmäßige Verteilung
                            let yOffset = 0;
                            if (totalForThisGrade > 1) {
                                // Maximaler Offset ist die Hälfte der Rechteckhöhe
                                const maxOffset = (aiGradeGroups[roundedGrade] / aiMaxCount) * 40 / 2 * 0.9;
                                yOffset = ((currentCount - 1) / (totalForThisGrade - 1) * 2 - 1) * maxOffset;
                            }

                            return (
                                <circle
                                    key={i}
                                    cx={x}
                                    cy={yOffset}
                                    r="2"
                                    fill={chartColors.PRIMARY}
                                    stroke="white"
                                    strokeWidth="0.5"
                                >
                                    <title>{t('grade', 'labels')}: {grade.toFixed(1)} (Work {i+1})</title>
                                </circle>
                            );
                        });
                    })()}

                    <text x={padding-25} y="0" textAnchor="end" dominantBaseline="middle" fontSize="10" fill={chartColors.PRIMARY}>
                        {t('ai', 'labels')}
                    </text>
                </g>

                {/* Human Violin */}
                <g transform={`translate(0, ${yHuman})`}>
                    {/* Violin-Form basierend auf tatsächlichen Punkten */}
                    {Object.entries(humanGradeGroups).map(([grade, count], i) => {
                        const x = gradeToX(parseFloat(grade));
                        const height = (count / humanMaxCount) * 40; // Maximale Höhe

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

                    {/* Scatter-Punkte an der exakten Position */}
                    {(() => {
                        const pointsCount = {}; // Zähler für gleichartige Punkte

                        return data.humanGrades.map((grade, i) => {
                            const x = gradeToX(grade);
                            const roundedGrade = Math.round(grade * 10) / 10;

                            // Zähle, wie oft wir diese Note bereits gesehen haben
                            pointsCount[roundedGrade] = (pointsCount[roundedGrade] || 0) + 1;
                            const currentCount = pointsCount[roundedGrade];

                            // Gesamtzahl für diese Note (aus humanGradeGroups)
                            const totalForThisGrade = humanGradeGroups[roundedGrade];

                            // Gleichmäßige Verteilung
                            let yOffset = 0;
                            if (totalForThisGrade > 1) {
                                // Maximaler Offset ist die Hälfte der Rechteckhöhe
                                const maxOffset = (humanGradeGroups[roundedGrade] / humanMaxCount) * 40 / 2 * 0.9;
                                yOffset = ((currentCount - 1) / (totalForThisGrade - 1) * 2 - 1) * maxOffset;
                            }

                            return (
                                <circle
                                    key={i}
                                    cx={x}
                                    cy={yOffset}
                                    r="2"
                                    fill={chartColors.SECONDARY}
                                    stroke="white"
                                    strokeWidth="0.5"
                                >
                                    <title>{t('grade', 'labels')}: {grade.toFixed(1)} (Work {i+1})</title>
                                </circle>
                            );
                        });
                    })()}

                    <text x={padding-25} y="0" textAnchor="end" dominantBaseline="middle" fontSize="10" fill={chartColors.SECONDARY}>
                        {t('human', 'labels')}
                    </text>
                </g>
            </svg>
        </BaseChartComponent>
    );
};

export default ViolinPlotComponent;