import React from 'react';
import BaseChartComponent from '../charts/BaseChartComponent';
import useChart from '../../hooks/useChart';
import { CHART_TYPES, ANALYSIS_TYPES } from '../../constants/chartConstants';
import {getDifferenceColor} from "../../utils/chartUtils";

const SpearmanCorrelationComponent = ({ data }) => {
    const {
        t,
        chartDimensions,
        chartColors,
        formatValue
    } = useChart({
        analysisType: ANALYSIS_TYPES.DASHBOARD,
        chartType: CHART_TYPES.RANK_CORRELATION
    });

    // Dimensions
    const height = chartDimensions.height;
    const width = 300;
    const padding = { top: 20, right: 20, bottom: 40, left: 50 };

    // Anzahl der Arbeiten
    const n = data.ranks.length;

    // FIXED: Scales - rank 1 should be at BOTTOM, rank n at TOP
    const xScale = (rank) => {
        return padding.left + (width - padding.left - padding.right) * (rank - 1) / (n - 1);
    };

    const yScale = (rank) => {
        // FIXED: Invert the scale so rank 1 is at bottom, rank n at top
        return padding.top + (height - padding.top - padding.bottom) * (n - rank) / (n - 1);
    };

    // Bestimme Stärke-Klasse für Spearman
    const getStrengthClass = () => {
        if (Math.abs(data.spearmanCoefficient) > 0.8) return 'correlation-strong';
        if (Math.abs(data.spearmanCoefficient) > 0.5) return 'correlation-moderate';
        return 'correlation-weak';
    };

    return (
        <div className="component-container correlation-container">
            <h4 className="subtitle">{t('rankCorrelation', 'dashboard')}</h4>

            <div className="correlation-value-container">
                <div className={`correlation-value ${getStrengthClass()}`}>
                    {formatValue(data.spearmanCoefficient)}
                </div>
                <div className="correlation-interpretation">
                    {t(data.correlationStrength + 'Correlation', 'dashboard')}
                </div>
            </div>

            <BaseChartComponent height={height}>
                <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
                    {/* Koordinatenachsen */}
                    <line x1={padding.left} y1={padding.top} x2={padding.left} y2={height-padding.bottom}
                          stroke="currentColor" strokeWidth="1" />
                    <line x1={padding.left} y1={height-padding.bottom} x2={width-padding.right} y2={height-padding.bottom}
                          stroke="currentColor" strokeWidth="1" />

                    {/* FIXED: Perfect correlation line - now goes from bottom-left to top-right */}
                    <line x1={padding.left} y1={height-padding.bottom} x2={width-padding.right} y2={padding.top}
                          stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />

                    {/* Achsenbeschriftungen */}
                    <text x={width/2} y={height-5} textAnchor="middle" fontSize="11" fill="currentColor">
                        {t('humanRank', 'dashboard')}
                    </text>
                    <text x={10} y={height/2} textAnchor="middle" fontSize="11"
                          fill="currentColor" transform={`rotate(-90, 10, ${height/2})`}>
                        {t('aiRank', 'dashboard')}
                    </text>

                    {/* X-axis ticks and labels - every second tick */}
                    {Array.from({length: Math.ceil(n/2)}, (_, i) => {
                        const rank = (i + 1) * 2; // 2, 4, 6, 8, ...
                        if (rank <= n) {
                            const x = xScale(rank);
                            return (
                                <g key={`x-tick-${i}`}>
                                    <line x1={x} y1={height-padding.bottom} x2={x} y2={height-padding.bottom+5}
                                          stroke="currentColor" strokeWidth="1" />
                                    <text x={x} y={height-padding.bottom+15} textAnchor="middle" fontSize="10"
                                          fill="currentColor">
                                        {rank}
                                    </text>
                                </g>
                            );
                        }
                        return null;
                    })}

                    {/* Y-axis ticks and labels - every second tick */}
                    {Array.from({length: Math.ceil(n/2)}, (_, i) => {
                        const rank = (i + 1) * 2; // 2, 4, 6, 8, ...
                        if (rank <= n) {
                            const y = yScale(rank);
                            return (
                                <g key={`y-tick-${i}`}>
                                    <line x1={padding.left-5} y1={y} x2={padding.left} y2={y}
                                          stroke="currentColor" strokeWidth="1" />
                                    <text x={padding.left-8} y={y+3} textAnchor="end" fontSize="10"
                                          fill="currentColor">
                                        {rank}
                                    </text>
                                </g>
                            );
                        }
                        return null;
                    })}

                    {/* Scatter Plot */}
                    {data.ranks.map((item, i) => (
                        <g key={i}>
                            <circle
                                cx={xScale(item.humanRank)}
                                cy={yScale(item.aiRank)}
                                r="4"
                                fill={getDifferenceColor(Math.abs(item.rankDiff) * 5, chartColors)}
                                fillOpacity="0.7"
                            >
                                <title>{item.title} - AI: {item.aiRank}, Human: {item.humanRank}</title>
                            </circle>
                        </g>
                    ))}
                </svg>
            </BaseChartComponent>
        </div>
    );
};

export default SpearmanCorrelationComponent;