import React, { useMemo } from 'react';
import {
    ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, ZAxis, Cell, Legend
} from 'recharts';
import { useTranslation } from '../../hooks/useTranslation';
import './styles/correlation.css';

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

// Benutzerdefinierter Tooltip für den Scatter Plot
const CustomTooltip = ({ active, payload, label, translations, language }) => {
    const t = useTranslation(language);

    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="custom-tooltip">
                <p className="tooltip-title">{data.name}</p>
                <p className="tooltip-item">
                    <span className="tooltip-label">{t('ki', 'labels')}:</span>
                    <span className="tooltip-value">{data.kiScore}%</span>
                </p>
                <p className="tooltip-item">
                    <span className="tooltip-label">{t('human', 'labels')}:</span>
                    <span className="tooltip-value">{data.humanScore}%</span>
                </p>
                <p className="tooltip-item">
                    <span className="tooltip-label">{t('difference', 'labels')}:</span>
                    <span className="tooltip-value">{data.scoreDiff}%</span>
                </p>
                <p className="tooltip-item">
                    <span className="tooltip-label">{t('variance', 'labels')}:</span>
                    <span className="tooltip-value">{data.variance.toFixed(2)}</span>
                </p>
            </div>
        );
    }

    return null;
};

const CorrelationAnalysisComponent = ({ work, translations, language }) => {
    const t = useTranslation(language);
    const criteriaData = useMemo(() => {
        const kiVariances = work.criteriaKeys.map((label, index) => ({
            name: label,
            variance: calculateVariance([work.aiScores[index], work.humanScores[index]]),
            kiScore: work.aiScores[index],
            humanScore: work.humanScores[index],
            scoreDiff: Math.abs(work.aiScores[index] - work.humanScores[index])
        }));

        return kiVariances.sort((a, b) => b.variance - a.variance);
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
                    name1: work.criteriaKeys[i],
                    name2: work.criteriaKeys[j],
                    correlation: correlation.toFixed(2)
                });
            }
        }

        return result;
    }, [work]);

    const getCorrelationColor = (value) => {
        const absValue = Math.abs(value);
        if (absValue > 0.7) return '#82ca9d'; // Strong correlation - green
        if (absValue > 0.3) return '#8884d8'; // Medium correlation - purple
        return '#ff7300'; // Weak correlation - orange
    };

    return (
        <div>
            <h3 className="chart-title">{t('varianceTitle', 'chartTitles') || "Criteria Variance Analysis"}</h3>
            <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                    <ScatterChart
                        margin={{ top: 20, right: 30, bottom: 60, left: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            type="number"
                            dataKey="kiScore"
                            name={t('ki', 'labels')}
                            domain={[0, 100]}
                            label={{
                                value: t('ki', 'labels') + ' ' + t('score', 'labels'),
                                position: 'bottom',
                                offset: 10
                            }}
                        />
                        <YAxis
                            type="number"
                            dataKey="humanScore"
                            name={t('human', 'labels')}
                            domain={[0, 100]}
                            label={{
                                value: t('human', 'labels') + ' ' + t('score', 'labels'),
                                angle: -90,
                                position: 'insideLeft',
                                offset: -5,
                                style: { textAnchor: 'middle' }
                            }}
                        />
                        <ZAxis
                            type="number"
                            dataKey="variance"
                            range={[50, 250]}
                            name={t('variance', 'labels') || "Variance"}
                        />
                        <Tooltip
                            content={<CustomTooltip translations={translations} language={language} />}
                            cursor={{ strokeDasharray: '3 3' }}
                        />
                        <Legend
                            verticalAlign="top"
                            height={36}
                        />
                        <Scatter
                            name={t('criteriaVariance', 'labels') || "Criteria Variance"}
                            data={criteriaData}
                            fill="#8884d8"
                        >
                            {criteriaData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.scoreDiff > 20 ? '#ff7300' : '#82ca9d'}
                                />
                            ))}
                        </Scatter>
                    </ScatterChart>
                </ResponsiveContainer>
            </div>

            <div className="variance-table">
                <h4 className="subtitle">{t('varianceTable', 'chartTitles') || "Criteria Ranked by Variance"}</h4>
                <table className="mini-table">
                    <thead>
                    <tr>
                        <th>{t('criterion', 'tableHeaders')}</th>
                        <th>{t('ki', 'labels')}</th>
                        <th>{t('human', 'labels')}</th>
                        <th>{t('difference', 'labels') || "Difference"}</th>
                        <th>{t('variance', 'labels') || "Variance"}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {criteriaData.slice(0, 5).map((item, index) => (
                        <tr key={index} className={item.scoreDiff > 20 ? "highlight-row" : ""}>
                            <td>{item.name}</td>
                            <td>{item.kiScore}%</td>
                            <td>{item.humanScore}%</td>
                            <td>{Math.abs(item.kiScore - item.humanScore)}%</td>
                            <td>{item.variance.toFixed(2)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CorrelationAnalysisComponent;