import React, { memo, useMemo } from 'react';
import {
    ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ZAxis, Cell, Legend
} from 'recharts';
import { CHART_DIMENSIONS, CHART_MARGINS } from '../../constants/chartConfig';
import CustomTooltip from './CustomTooltip';
import BaseChartComponent from './BaseChartComponent';
import { DATA_KEYS } from "../../constants/chartConstants";
import {
    calculateCriteriaDeviationData,
    calculateCriteriaCorrelationData
} from '../../utils/statistics/correlationAnalysisUtils';
import useChart from "../../hooks/useChart";

const CriteriaAnalysisComponent = memo(({ work, chartType }) => {
    const {
        t,
        CHART_COLORS,
        defaultLegendProps
    } = useChart({ chartType });

    // Verwende die ausgelagerten Berechnungsfunktionen
    const criteriaData = useMemo(() => {
        return calculateCriteriaDeviationData(work);
    }, [work]);

    const correlationData = useMemo(() => {
        return calculateCriteriaCorrelationData(work);
    }, [work]);

    // Tooltip-Formatter mit der neuen Metrik
    const tooltipFormatter = useMemo(() => {
        return (data) => {
            return {
                title: data.name,
                items: [
                    { name: t('ai', 'labels'), value: data[DATA_KEYS.AI_SCORE] + "%", className: "ai" },
                    { name: t('human', 'labels'), value: data[DATA_KEYS.HUMAN_SCORE] + "%", className: "human" },
                    { name: t('difference', 'labels'), value: data.scoreDiff + "%", className: "" },
                    { name: t('deviation', 'labels'), value: data.deviation.toFixed(2), className: "" }
                ]
            };
        };
    }, [t]);

    return (
        <div>
            <h3 className="section-title">{t('deviationTitle', 'chartTitles') || "Criteria Deviation Analysis"}</h3>
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
                            dataKey="deviation"
                            range={[50, 250]}
                            name={t('deviation', 'labels') || "Deviation"}
                        />
                        <Tooltip content={<CustomTooltip formatter={tooltipFormatter} />} />
                        <Legend {...defaultLegendProps} />
                        <Scatter
                            name={t('criteriaDeviations', 'labels') || "Criteria Deviations"}
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

            <div className="table-container">
                <h3 className="section-title">{t('deviationTable', 'chartTitles') || "Criteria Ranked by Deviation"}</h3>
                <table className="data-table">
                    <thead>
                    <tr>
                        <th>{t('criterion', 'tableHeaders')}</th>
                        <th>{t('ai', 'labels')}</th>
                        <th>{t('human', 'labels')}</th>
                        <th>{t('difference', 'labels') || "Difference"}</th>
                        <th>{t('deviation', 'labels') || "Deviation"}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {criteriaData.slice(0, 5).map((item, index) => (
                        <tr key={index} className={index % 2 === 0 ? "even-row" : "odd-row"}>
                            <td>{item.name}</td>
                            <td>{item.aiScore}%</td>
                            <td>{item.humanScore}%</td>
                            <td>{item.scoreDiff}%</td>
                            <td>{item.deviation.toFixed(2)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div className="correlation-matrix">
                <h4 className="section-title">{t('correlationTitle', 'chartTitles')}</h4>

                <div className="analysis-grid big-cells">
                    {correlationData
                        .sort((a, b) => Math.abs(parseFloat(b.correlation)) - Math.abs(parseFloat(a.correlation)))
                        .slice(0, 10)
                        .map((item, index) => {
                            // Klassen und Anzeige basierend auf Korrelationsstärke
                            const corrValue = parseFloat(item.correlation);
                            const absValue = Math.abs(corrValue);
                            let intensityClass = "low-intensity";

                            if (absValue > 0.7) {
                                intensityClass = "high-intensity";
                            } else if (absValue > 0.3) {
                                intensityClass = "medium-intensity";
                            }

                            return (
                                <div
                                    key={index}
                                    className={`color-cell ${intensityClass}`}
                                    title={`${item.name1} - ${item.name2}: ${item.correlation}`}
                                >
                                    <div className="cell-value">
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

// Umbenennung des Exports
export default CriteriaAnalysisComponent;