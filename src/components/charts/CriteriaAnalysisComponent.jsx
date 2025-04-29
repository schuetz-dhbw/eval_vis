import React, { memo, useMemo } from 'react';
import { ScatterChart, Scatter, ZAxis, Cell } from 'recharts';
import BaseChartComponent from './BaseChartComponent';
import { DATA_KEYS } from "../../constants/chartConstants";
import {
    calculateCriteriaDeviationData,
    calculateCriteriaCorrelationData
} from '../../utils/statistics/criteriaAnalysisUtils';
import useChart from "../../hooks/useChart";
import {CHART_TYPES} from "../../constants/chartTypes";
import {renderScatterChartBase, getIntensityClass } from "../../utils/chartUtils";

const CriteriaAnalysisComponent = memo(({ work }) => {
    const {
        t,
        chartDimensions,
        chartColors,
        commonChartConfig,
        tooltipConfig,
        defaultLegendProps,
        scatterConfig  // Hier aus dem Hook holen
    } = useChart({ chartType: CHART_TYPES.STATISTICS, isScatter: true });

    // Verwende die ausgelagerten Berechnungsfunktionen
    const criteriaData = useMemo(() => {
        return calculateCriteriaDeviationData(work);
    }, [work]);

    const correlationData = useMemo(() => {
        return calculateCriteriaCorrelationData(work);
    }, [work]);

    // Tooltip-Formatter mit der neuen Metrik
    /*
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
     */

    return (
        <div className="flex-column">
            <div className="component-container">
                <h3 className="section-title">{t('deviationTitle', 'chartTitles')}</h3>
                <div className="chart-wrapper">
                    <BaseChartComponent height={chartDimensions.height}>
                    <ScatterChart margin={commonChartConfig.margin}>
                        {renderScatterChartBase(t,
                            { xDataKey: DATA_KEYS.AI_SCORE, yDataKey: DATA_KEYS.HUMAN_SCORE },
                            tooltipConfig,
                            defaultLegendProps
                        )}
                        <ZAxis
                            type="number"
                            dataKey="deviation"
                            range={scatterConfig.zRange}
                            name={t('deviation', 'labels')}
                        />
                        <Scatter
                            name={t('criteriaDeviations', 'labels')}
                            data={criteriaData}
                            fill={chartColors.PRIMARY}
                        >
                            {criteriaData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.scoreDiff > 20 ? chartColors.TERTIARY : chartColors.SECONDARY}
                                />
                            ))}
                        </Scatter>
                    </ScatterChart>
                </BaseChartComponent>
            </div>
            </div>

            <div className="component-container">
                <h3 className="section-title">{t('deviationTable', 'chartTitles')}</h3>
                <div className="table-container">
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
            </div>
            <div className="component-container">
                <h3 className="section-title">{t('correlationTitle', 'chartTitles')}</h3>
                <div className="analysis-grid big-cells">
                    {correlationData
                        .sort((a, b) => Math.abs(parseFloat(b.correlation)) - Math.abs(parseFloat(a.correlation)))
                        .slice(0, 10)
                        .map((item, index) => {
                            // Klassen und Anzeige basierend auf Korrelationsstärke
                            const corrValue = parseFloat(item.correlation);
                            const intensityClass = getIntensityClass(corrValue, { high: 0.7, medium: 0.3 });

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