import React, { useMemo } from 'react';
import BaseChartComponent from '../charts/BaseChartComponent';
import useChart from '../../hooks/useChart';
import { CHART_TYPES } from '../../constants/chartConstants';

const GradeBoxplotComponent = ({ data, analysisType, works }) => { // ADD works prop
    const {
        t,
        chartColors
    } = useChart({
        analysisType,
        chartType: CHART_TYPES.BOXPLOT
    });

    // Smaller dimensions
    const width = 400; // REDUCED from 800
    const height = 600;
    const margin = { top: 40, right: 60, bottom: 60, left: 60 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;

    // Calculate scale for grades
    const minGrade = Math.min(data[0].min, data[1].min) - 0.2;
    const maxGrade = Math.max(data[0].max, data[1].max) + 0.2;
    const gradeRange = maxGrade - minGrade;

    // Scale function
    const yScale = (grade) => {
        return margin.top + plotHeight - ((grade - minGrade) / gradeRange) * plotHeight;
    };

    // Box positions
    const boxWidth = 60; // REDUCED from 80
    const aiBoxX = margin.left + plotWidth * 0.25 - boxWidth / 2;
    const humanBoxX = margin.left + plotWidth * 0.75 - boxWidth / 2;

    // Prepare data points for scatter overlay
    const dataPoints = useMemo(() => {
        if (!works || works.length === 0) return { aiPoints: [], humanPoints: [] };

        const aiPoints = works.map(work => work.aiGrade);
        const humanPoints = works.map(work => work.humanGrade);

        return { aiPoints, humanPoints };
    }, [works]);

    // Generate jittered positions for data points
    const scatterPoints = useMemo(() => {
        const points = [];
        const jitterWidth = 25; // Jitter range around center

        // AI points
        dataPoints.aiPoints.forEach((grade, index) => {
            const centerX = aiBoxX + boxWidth / 2;
            const jitterX = centerX + (Math.random() - 0.5) * jitterWidth;
            const y = yScale(grade);

            points.push({
                key: `ai-${index}`,
                x: jitterX,
                y: y,
                grade: grade,
                type: 'AI',
                color: chartColors.PRIMARY,
                work: works ? works[index]?.title || works[index]?.key : `Work ${index + 1}`
            });
        });

        // Human points
        dataPoints.humanPoints.forEach((grade, index) => {
            const centerX = humanBoxX + boxWidth / 2;
            const jitterX = centerX + (Math.random() - 0.5) * jitterWidth;
            const y = yScale(grade);

            points.push({
                key: `human-${index}`,
                x: jitterX,
                y: y,
                grade: grade,
                type: 'Human',
                color: chartColors.SECONDARY,
                work: works ? works[index]?.title || works[index]?.key : `Work ${index + 1}`
            });
        });

        return points;
    }, [dataPoints, aiBoxX, humanBoxX, boxWidth, yScale, chartColors, works]);

    // Memoize boxplot elements
    const boxplotElements = useMemo(() => {
        const elements = [];

        [data[0], data[1]].forEach((stats, index) => {
            const isAI = index === 0;
            const boxX = isAI ? aiBoxX : humanBoxX;
            const color = isAI ? chartColors.PRIMARY : chartColors.SECONDARY;
            const centerX = boxX + boxWidth / 2;

            // Calculate y positions
            const minY = yScale(stats.min);
            const q1Y = yScale(stats.q1);
            const medianY = yScale(stats.median);
            const q3Y = yScale(stats.q3);
            const maxY = yScale(stats.max);

            // Whiskers (min to Q1, Q3 to max)
            elements.push(
                // Lower whisker
                <line key={`${index}-lower-whisker`} x1={centerX} y1={minY} x2={centerX} y2={q1Y}
                      stroke={color} strokeWidth="2" />,
                // Upper whisker
                <line key={`${index}-upper-whisker`} x1={centerX} y1={q3Y} x2={centerX} y2={maxY}
                      stroke={color} strokeWidth="2" />,
                // Min cap
                <line key={`${index}-min-cap`} x1={centerX - 15} y1={minY} x2={centerX + 15} y2={minY}
                      stroke={color} strokeWidth="2" />,
                // Max cap
                <line key={`${index}-max-cap`} x1={centerX - 15} y1={maxY} x2={centerX + 15} y2={maxY}
                      stroke={color} strokeWidth="2" />
            );

            // Box (Q1 to Q3) - with transparency so points show through
            const boxHeight = q1Y - q3Y;
            elements.push(
                <rect key={`${index}-box`} x={boxX} y={q3Y} width={boxWidth} height={boxHeight}
                      fill={color} fillOpacity="0.2" stroke={color} strokeWidth="2" />
            );

            // Median line
            elements.push(
                <line key={`${index}-median`} x1={boxX} y1={medianY} x2={boxX + boxWidth} y2={medianY}
                      stroke={color} strokeWidth="3" />
            );

            // Label
            elements.push(
                <text key={`${index}-label`} x={centerX} y={height - margin.bottom + 20}
                      textAnchor="middle" fontSize="14" fill={color}>
                    {isAI ? t('ai', 'labels') : t('human', 'labels')}
                </text>
            );
        });

        return elements;
    }, [data, aiBoxX, humanBoxX, boxWidth, chartColors, yScale, t, height, margin]);

    // Y-axis ticks
    const yTicks = useMemo(() => {
        const ticks = [];
        const step = 0.5;
        const startGrade = Math.ceil(minGrade * 2) / 2;
        const endGrade = Math.floor(maxGrade * 2) / 2;

        for (let grade = startGrade; grade <= endGrade; grade += step) {
            const y = yScale(grade);
            const isFullGrade = grade % 1 === 0;

            ticks.push(
                <g key={`tick-${grade}`}>
                    <line x1={margin.left - 5} y1={y} x2={margin.left} y2={y}
                          stroke="currentColor" strokeWidth={isFullGrade ? "1" : "0.5"} />
                    {isFullGrade && (
                        <text x={margin.left - 10} y={y + 3} textAnchor="end" fontSize="12"
                              fill="currentColor">
                            {grade.toFixed(0)}
                        </text>
                    )}
                </g>
            );
        }

        return ticks;
    }, [minGrade, maxGrade, yScale, margin]);

    return (
        <BaseChartComponent height={height}>
            <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
                {/* Y-axis */}
                <line x1={margin.left} y1={margin.top} x2={margin.left} y2={height - margin.bottom}
                      stroke="currentColor" strokeWidth="1" />

                {/* Y-axis ticks */}
                {yTicks}

                {/* Y-axis label */}
                <text x={20} y={height / 2} textAnchor="middle" fontSize="12" fill="currentColor"
                      transform={`rotate(-90, 20, ${height / 2})`}>
                    {t('grade', 'labels')}
                </text>

                {/* Grid lines for major grades */}
                {[1, 2, 3, 4, 5, 6].map(grade => {
                    if (grade >= minGrade && grade <= maxGrade) {
                        const y = yScale(grade);
                        return (
                            <line key={`grid-${grade}`}
                                  x1={margin.left} y1={y}
                                  x2={width - margin.right} y2={y}
                                  stroke="currentColor" strokeWidth="0.3"
                                  strokeDasharray="2,2" opacity="0.5" />
                        );
                    }
                    return null;
                })}

                {/* Boxplot elements */}
                {boxplotElements}

                {/* Data points overlay */}
                {scatterPoints.map((point) => (
                    <circle
                        key={point.key}
                        cx={point.x}
                        cy={point.y}
                        r="3"
                        fill={point.color}
                        fillOpacity="0.7"
                        stroke="white"
                        strokeWidth="0.5"
                    >
                        <title>{point.work}: {point.type} {t('grade', 'labels')} {point.grade.toFixed(1)}</title>
                    </circle>
                ))}

                {/* Title */}
                <text x={width / 2} y={25} textAnchor="middle" fontSize="14" fill="currentColor"
                      fontWeight="bold">
                    {t('gradeDistribution', 'dashboard')} - {t('gradeBoxplot', 'dashboard')}
                </text>
            </svg>
        </BaseChartComponent>
    );
};

export default React.memo(GradeBoxplotComponent);