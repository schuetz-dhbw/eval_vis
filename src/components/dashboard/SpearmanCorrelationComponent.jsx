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

    // Dimensionen
    const height = chartDimensions.height;
    const width = 300;
    const padding = { top: 20, right: 20, bottom: 40, left: 50 };

    // Anzahl der Arbeiten
    const n = data.ranks.length;

    // Skalen für x und y
    const xScale = (rank) => {
        return padding.left + (width - padding.left - padding.right) * (rank - 1) / n;
    };

    const yScale = (rank) => {
        return padding.top + (height - padding.top - padding.bottom) * (rank - 1) / n;
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

                    {/* Achsenbeschriftungen */}
                    <text x={width/2} y={height-5} textAnchor="middle" fontSize="11" fill="currentColor">
                        {t('humanRank', 'dashboard')}
                    </text>
                    <text x={10} y={height/2} textAnchor="middle" fontSize="11"
                          fill="currentColor" transform={`rotate(-90, 10, ${height/2})`}>
                        {t('aiRank', 'dashboard')}
                    </text>

                    {/* Datenpunkte und Linien für die perfekte Korrelation */}
                    <line x1={padding.left} y1={padding.top} x2={width-padding.right} y2={height-padding.bottom}
                          stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />

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