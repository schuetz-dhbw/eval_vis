import React, { useMemo } from 'react';
import BaseChartComponent from '../charts/BaseChartComponent';
import useChart from '../../hooks/useChart';
import { CHART_TYPES, ANALYSIS_TYPES } from '../../constants/chartConstants';
import { getDifferenceColor } from '../../utils/chartUtils';

const ParallelCoordinatePlotComponent = ({ data }) => {
    const {
        t,
        chartColors
    } = useChart({
        analysisType: ANALYSIS_TYPES.DASHBOARD,
        chartType: CHART_TYPES.PARALLEL
    });

    // Dimensionen
    const height = 600;
    const width = 800;
    const padding = { top: 40, right: 60, bottom: 40, left: 60 };

    // Min/Max-Werte berechnen
    const minGrade = useMemo(() => Math.floor(
        Math.min(...data.map(d => Math.min(d.aiGrade, d.humanGrade)))
    ), [data]);

    const maxGrade = useMemo(() => Math.ceil(
        Math.max(...data.map(d => Math.max(d.aiGrade, d.humanGrade)))
    ), [data]);

    // Positionsberechnungen
    const xAI = padding.left;
    const xHuman = width - padding.right;

    const yScale = (grade) => {
        return padding.top + (height - padding.top - padding.bottom) *
            (grade - minGrade) / (maxGrade - minGrade);
    };

    return (
        <BaseChartComponent height={height}>
            <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
                {/* Achsen zeichnen */}
                <line x1={xAI} y1={padding.top} x2={xAI} y2={height-padding.bottom}
                      stroke="currentColor" strokeWidth="1" />
                <line x1={xHuman} y1={padding.top} x2={xHuman} y2={height-padding.bottom}
                      stroke="currentColor" strokeWidth="1" />

                {/* Achsenbeschriftungen */}
                <text x={xAI} y={padding.top-15} textAnchor="middle" fill={chartColors.PRIMARY} fontSize="12">
                    {t('ai', 'labels')}
                </text>
                <text x={xHuman} y={padding.top-15} textAnchor="middle" fill={chartColors.SECONDARY} fontSize="12">
                    {t('human', 'labels')}
                </text>

                {/* Y-Achsen-Labels */}
                {Array.from({ length: Math.round((maxGrade - minGrade) * 10) + 1 }, (_, i) => {
                    const grade = minGrade + i / 10;
                    const isFullGrade = Math.abs(Math.round(grade) - grade) < 0.05;
                    const isFifthGrade = Math.abs(grade - Math.floor(grade) - 0.5) < 0.05;

                    const gradeToY = (grade) => {
                        // Diese Version hat 1 oben und 4 unten
                        return padding.top + (height - padding.top - padding.bottom) *
                            ((grade - minGrade) / (maxGrade - minGrade));
                    };

                    return (
                        <React.Fragment key={i}>
                            {/* Nur volle und .5-Schritte beschriften */}
                            {(isFullGrade || isFifthGrade) && (
                                <>
                                    <text
                                        x={xAI-5}
                                        y={gradeToY(grade)+3}
                                        textAnchor="end"
                                        fontSize={isFullGrade ? 12 : 10}
                                        fill="currentColor"
                                    >
                                        {isFullGrade ? Math.round(grade) : grade.toFixed(1)}
                                    </text>
                                    <text
                                        x={xHuman+5}
                                        y={gradeToY(grade)+3}
                                        textAnchor="start"
                                        fontSize={isFullGrade ? 12 : 10}
                                        fill="currentColor"
                                    >
                                        {isFullGrade ? Math.round(grade) : grade.toFixed(1)}
                                    </text>
                                </>
                            )}

                            {/* Alle 0.1-Schritte als Striche markieren */}
                            <line
                                x1={xAI-3}
                                x2={xAI}
                                y1={gradeToY(grade)}
                                y2={gradeToY(grade)}
                                stroke="currentColor"
                                strokeWidth={isFullGrade ? 1 : (isFifthGrade ? 0.75 : 0.5)}
                            />
                            <line
                                x1={xHuman}
                                x2={xHuman+3}
                                y1={gradeToY(grade)}
                                y2={gradeToY(grade)}
                                stroke="currentColor"
                                strokeWidth={isFullGrade ? 1 : (isFifthGrade ? 0.75 : 0.5)}
                            />
                        </React.Fragment>
                    );
                })}

                {/* Verbindungslinien zeichnen */}
                {data.map((item, i) => {
                    const y1 = yScale(item.aiGrade);
                    const y2 = yScale(item.humanGrade);
                    const lineColor = getDifferenceColor(item.difference * 25, chartColors);

                    return (
                        <g key={i}>
                            <line
                                x1={xAI} y1={y1}
                                x2={xHuman} y2={y2}
                                stroke={lineColor}
                                strokeWidth="1.5"
                                strokeOpacity="0.7"
                            />
                            <circle cx={xAI} cy={y1} r="3" fill={chartColors.PRIMARY} />
                            <circle cx={xHuman} cy={y2} r="3" fill={chartColors.SECONDARY} />

                            {/* Tooltips über title-Attribut */}
                            <title>{item.title}: AI {item.aiGrade}, Human {item.humanGrade}</title>
                        </g>
                    );
                })}

                {/* Legende */}
                <g transform={`translate(${width/2}, ${height-10})`}>
                    <text textAnchor="middle" fontSize="10" fill="currentColor">
                        {t('lineColorIndicatesDifference', 'dashboard')}
                    </text>
                </g>
            </svg>
        </BaseChartComponent>
    );
};

export default ParallelCoordinatePlotComponent;