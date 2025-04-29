import React, { memo, useMemo } from 'react';
import { ScatterChart, Scatter, ZAxis, Cell } from 'recharts';
import {CHART_DIMENSIONS, SCATTER_CONFIG} from '../../constants/chartConfig';
import BaseChartComponent from './BaseChartComponent';
import { DATA_KEYS } from "../../constants/chartConstants";
import {
    calculateCriteriaDeviationData,
    calculateCriteriaCorrelationData
} from '../../utils/statistics/correlationAnalysisUtils';
import useChart from "../../hooks/useChart";
import {CHART_TYPES} from "../../constants/chartTypes";
import {renderScatterChartBase} from "../../utils/chartUtils";

const CriteriaAnalysisComponent = memo(({ work }) => {
    const {
        t,
        CHART_COLORS,
        commonChartConfig,
        defaultLegendProps
    } = useChart({ chartType: CHART_TYPES.STATISTICS });

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
            <h3 className="section-title">{t('deviationTitle', 'chartTitles')}</h3>
            <div className="chart-wrapper">
                <BaseChartComponent height={CHART_DIMENSIONS.CORRELATION_HEIGHT}>
                    <ScatterChart margin={commonChartConfig.margin}>
                        {renderScatterChartBase(t,
                            { xDataKey: DATA_KEYS.AI_SCORE, yDataKey: DATA_KEYS.HUMAN_SCORE },
                            { formatter: tooltipFormatter },
                            defaultLegendProps
                        )}
                        <ZAxis
                            type="number"
                            dataKey="deviation"
                            range={SCATTER_CONFIG.Z_RANGE}
                            name={t('deviation', 'labels')}
                        />
                        <Scatter
                            name={t('criteriaDeviations', 'labels')}
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
                <h3 className="section-title">{t('deviationTable', 'chartTitles')}</h3>
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
                                    className={`analysis-cell ${intensityClass}`}
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