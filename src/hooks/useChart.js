import { useMemo } from 'react';
import { useTranslation } from './useTranslation';
import {
    getChartColors,
    getChartConfig,
    CHART_DIMENSIONS
} from '../constants/chartConfig';
import { METRICS } from '../constants/metrics';
import {DATA_KEYS, CHART_TYPES, ANALYSIS_TYPES} from "../constants/chartConstants";

/**
 * useChart - Ein Hook für wiederverwendbare Chart-Funktionalität
 *
 * @param {Object} options - Die Konfigurationsoptionen
 * @param {string} options.analysisType - Der Chart-Typ (scores, weights, combined usw.)
 * @param {string} options.chartType - Der Chart-Modus (standard, radar, scatter, workType)
 * @returns {Object} - Chart-bezogene Hilfsfunktionen und Daten
 */
const useChart = ({
                      analysisType,
                      chartType
                  }) => {
    const t = useTranslation();
    const chartColors = getChartColors();

    // Holen der modus-spezifischen Konfiguration
    const chartConfig = useMemo(() => getChartConfig(chartType), [chartType]);

    // Einheitliche Chart-Dimensionen basierend auf dem Modus
    const chartDimensions = useMemo(() => {
        switch(chartType) {
            case CHART_TYPES.RADAR:
                return { height: CHART_DIMENSIONS.RADAR_HEIGHT };
            case CHART_TYPES.SCATTER:
                return { height: CHART_DIMENSIONS.SCATTER_HEIGHT };
            default:
                return { height: CHART_DIMENSIONS.DEFAULT_HEIGHT };
        }
    }, [chartType]);

    const formatValue = useMemo(() => {
        return (value) => {
            if (value === undefined || value === null) return '';
            return Number(value).toFixed(METRICS.DEFAULT_DECIMAL_PLACES);
        };
    }, []);

    // Y-axis domain based on chart type and analysis type
    const yDomain = useMemo(() => {
        if (chartType === CHART_TYPES.COMBINED || chartType === CHART_TYPES.SCATTER || chartType === CHART_TYPES.HEATMAP)
            return [0, METRICS.FULL_MARK];
        else if (chartType === CHART_TYPES.LINE || chartType === CHART_TYPES.BAR || chartType === CHART_TYPES.RADAR)
            if (analysisType === ANALYSIS_TYPES.SCORES)
                return [0, METRICS.FULL_MARK];
            else
                return [0, METRICS.DATA_MAX];
    }, [analysisType, chartType]);

    // Tooltip-Konfiguration für verschiedene Chart-Typen
    const tooltipConfig = useMemo(() => {
        if (analysisType === ANALYSIS_TYPES.DASHBOARD) {
            return {
                formatter: formatValue,
                labelFormatter: (data) => {
                    return `${data.type} (${t('count', 'tableHeaders')}: ${data.count})`;
                }
            };
        }
        else if (analysisType === ANALYSIS_TYPES.STATISTICS && chartType === CHART_TYPES.SCATTER) {
            // Spezieller Formatter für die Criteria-Analyse
            return {
                formatter: (data) => {
                    return {
                        title: data.name,
                        items: [
                            { name: t('ai', 'labels'), value: data.aiScore + "%", className: "ai" },
                            { name: t('human', 'labels'), value: data.humanScore + "%", className: "human" },
                            { name: t('difference', 'labels'), value: data.scoreDiff + "%", className: "" },
                            { name: t('deviation', 'labels'), value: data.deviation.toFixed(2), className: "" }
                        ]
                    };
                },
                labelFormatter: (data) => data.name || ''
            };
        }
        else {
            return {
                formatter: formatValue,
                labelFormatter: (data) => {
                    return data[DATA_KEYS.SHORT_NAME] || data[DATA_KEYS.NAME] || 'No data key name found.';
                }
            };
        }
    }, [analysisType, chartType, formatValue, t]);

    const defaultLegendProps = useMemo(() => {
        return {
            verticalAlign: "top",
            height: 36
        };
    }, []);

    // Gemeinsame Konfiguration für Charts
    const commonChartConfig = useMemo(() => {
        return {
            margin: chartConfig.margin
        };
    }, [chartConfig.margin]);

// Achsen-Konfiguration
    const axisConfig = useMemo(() => {
        return {
            xAxis: {
                dataKey: DATA_KEYS.SHORT_NAME,
                ...(chartType === CHART_TYPES.SCATTER ?
                    { type: 'number', domain: [0, 100] } :
                    { angle: -45, textAnchor: 'end', height: 70, tick: { fontSize: 10 } })
            },
            yAxis: {
                domain: yDomain,
                tickFormatter: formatValue
            }
        };
    }, [chartType, yDomain, formatValue]);

// Radar-spezifische Konfiguration
    const radarConfig = useMemo(() => {
        if (chartType !== CHART_TYPES.RADAR) return null;

        return {
            outerRadius: chartConfig.outerRadius,
            margin: chartConfig.margin,
            polarAngleAxis: chartConfig.polarAxes?.angleAxis,
            polarRadiusAxis: {
                ...chartConfig.polarAxes?.radiusAxis,
                domain: yDomain
            },
            radar: chartConfig.radar
        };
    }, [chartType, chartConfig, yDomain]);

// Scatter-spezifische Konfiguration
    const scatterConfig = useMemo(() => {
        if (chartType !== CHART_TYPES.SCATTER) return null;

        return {
            zRange: chartConfig.zRange,
            dot: chartConfig.dot
        };
    }, [chartType, chartConfig]);

    // Konfigurationen je nach Modus auswählen
    return {
        t,
        chartDimensions,
        chartColors,
        formatValue,
        yDomain,
        tooltipConfig,
        defaultLegendProps,
        commonChartConfig,
        axisConfig,
        radarConfig,
        scatterConfig
    };
};

export default useChart;