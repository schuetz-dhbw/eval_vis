import React, { memo, useMemo } from 'react';
import {
    ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ZAxis, Cell, Legend
} from 'recharts';
import { CHART_DIMENSIONS, CHART_MARGINS, getChartColors } from '../../constants/chartConfig';
import { useTranslation } from '../../hooks/useTranslation';
import CustomTooltip from './CustomTooltip';
import './styles/correlation.css';
import BaseChartComponent from './BaseChartComponent';
import {DATA_KEYS} from "../../constants/chartConstants";

const calculateCorrelation = (x, y) => {
    const n = x.length;
    if (n === 0) return 0;

    // Calculate means
    const xMean = x.reduce((sum, val) => sum + val, 0) / n;
    const yMean = y.reduce((sum, val) => sum + val, 0) / n;

    // Calculate correlation coefficient
    let numerator = 0;
    let xDenominator = 0;
    let yDenominator = 0;

    for (let i = 0; i < n; i++) {
        const xDiff = x[i] - xMean;
        const yDiff = y[i] - yMean;
        numerator += xDiff * yDiff;
        xDenominator += xDiff * xDiff;
        yDenominator += yDiff * yDiff;
    }

    if (xDenominator === 0 || yDenominator === 0) return 0;
    return numerator / Math.sqrt(xDenominator * yDenominator);
};

const calculateVariance = (data) => {
    const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
    return data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
};

const CorrelationAnalysisComponent = memo (({ work }) => {
    const t = useTranslation();
    const CHART_COLORS = getChartColors();

    const criteriaData = useMemo(() => {
        const aiVariances = work.criteriaKeys.map((label, index) => ({
            originalKey: label,
            name: work.criteriaLabels[index],
            variance: calculateVariance([work.aiScores[index], work.humanScores[index]]),
            aiScore: work.aiScores[index],
            humanScore: work.humanScores[index],
            scoreDiff: Math.abs(work.aiScores[index] - work.humanScores[index])
        }));

        return aiVariances.sort((a, b) => b.variance - a.variance);
    }, [work]);

    const correlationData = useMemo(() => {
        const result = [];

        for (let i = 0; i < work.criteriaKeys.length; i++) {
            for (let j = i + 1; j < work.criteriaKeys.length; j++) {
                const correlation = calculateCorrelation(
                    [work.aiScores[i], work.humanScores[i]],
                    [work.aiScores[j], work.humanScores[j]]
                );

                result.push({
                    x: i,
                    y: j,
                    z: Math.abs(correlation) * 100,
                    name1: work.criteriaLabels[i],
                    name2: work.criteriaLabels[j],
                    correlation: correlation.toFixed(2)
                });
            }
        }

        return result;
    }, [work]);

    const tooltipFormatter = useMemo(() => {
        return (data) => {
            // Hier darf kein JSX zurückgegeben werden, sondern nur String-Werte
            return {
                title: data.name,
                items: [
                    { name: t('ai', 'labels'), value: data[DATA_KEYS.AI_SCORE] + "%", className: "ai" },
                    { name: t('human', 'labels'), value: data[DATA_KEYS.HUMAN_SCORE] + "%", className: "human" },
                    { name: t('difference', 'labels'), value: data.scoreDiff + "%", className: "" },
                    { name: t('variance', 'labels'), value: data.variance.toFixed(2), className: "" }
                ]
            };
        };
    }, [t]);

    return (
        <div>
            <h3 className="section-title">{t('varianceTitle', 'chartTitles') || "Criteria Variance Analysis"}</h3>
            <div className="chart-wrapper">
                <BaseChartComponent height={CHART_DIMENSIONS.WORK_TYPE_HEIGHT}>
                    <ScatterChart
                        margin={CHART_MARGINS.DEFAULT}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            type="number"
                            dataKey={DATA_KEYS.AI_SCORE}
                            name={t('ai', 'labels')}
                            domain={[0, 100]}
                            label={{
                                value: t('ai', 'labels') + ' ' + t('score', 'labels'),
                                position: 'bottom',
                                offset: 0
                            }}
                        />
                        <YAxis
                            type="number"
                            dataKey={DATA_KEYS.HUMAN_SCORE}
                            name={t('human', 'labels')}
                            domain={[0, 100]}
                            label={{
                                value: t('human', 'labels') + ' ' + t('score', 'labels'),
                                angle: -90,
                                position: 'insideLeft',
                                offset: 10,
                                style: { textAnchor: 'middle' }
                            }}
                        />
                        <ZAxis
                            type="number"
                            dataKey="variance"
                            range={[50, 250]}
                            name={t('variance', 'labels') || "Variance"}
                        />
                        <Tooltip content={<CustomTooltip formatter={tooltipFormatter} />} />
                        <Legend
                            verticalAlign="top"
                            height={36}
                        />
                        <Scatter
                            name={t('criteriaVariance', 'labels') || "Criteria Variance"}
                            data={criteriaData}
                            fill={CHART_COLORS.PRIMARY}
                        >
                            {criteriaData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.scoreDiff > 20 ? CHART_COLORS.TERTIARY : CHART_COLORS.SECONDARY}
                                />
                            ))}
                        </Scatter>
                    </ScatterChart>
                </BaseChartComponent>
            </div>

            <div className="variance-table">
                <h4 className="subtitle">{t('varianceTable', 'chartTitles') || "Criteria Ranked by Variance"}</h4>
                <table className="data-table">
                    <thead>
                    <tr>
                        <th>{t('criterion', 'tableHeaders')}</th>
                        <th>{t('ai', 'labels')}</th>
                        <th>{t('human', 'labels')}</th>
                        <th>{t('difference', 'labels') || "Difference"}</th>
                        <th>{t('variance', 'labels') || "Variance"}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {criteriaData.slice(0, 5).map((item, index) => (
                        <tr key={index} className={item.scoreDiff > 20 ? "highlight-row" : ""}>
                            <td>{item.name}</td>
                            <td>{item.aiScore}%</td>
                            <td>{item.humanScore}%</td>
                            <td>{Math.abs(item.aiScore - item.humanScore)}%</td>
                            <td>{item.variance.toFixed(2)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div className="correlation-matrix">
                <h4 className="matrix-title">{t('correlationTitle', 'chartTitles') || "Correlation Analysis"}</h4>

                <div className="component-grid grid-template-columns-5">
                    {correlationData
                        .sort((a, b) => Math.abs(parseFloat(b.correlation)) - Math.abs(parseFloat(a.correlation)))
                        .slice(0, 10)
                        .map((item, index) => {
                            // Klassen und Anzeige basierend auf Korrelationsstärke
                            const corrValue = parseFloat(item.correlation);
                            const absValue = Math.abs(corrValue);
                            let correlationClass = "weak-correlation";

                            if (absValue > 0.7) {
                                correlationClass = "strong-correlation";
                            } else if (absValue > 0.3) {
                                correlationClass = "medium-correlation";
                            }

                            return (
                                <div
                                    key={index}
                                    className={`correlation-cell ${correlationClass}`}
                                    title={`${item.name1} - ${item.name2}: ${item.correlation}`}
                                >
                                    <div className="correlation-value">
                                        {corrValue > 0 ? "+" : ""}{item.correlation}
                                    </div>
                                    <div className="flex-column flex-center">
                                        <div>{item.name1}</div>
                                        <div>&amp;</div>
                                        <div>{item.name2}</div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>


        </div>
    );
});

export default CorrelationAnalysisComponent;