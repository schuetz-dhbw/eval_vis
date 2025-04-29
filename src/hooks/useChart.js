import { useMemo } from 'react';
import { useTranslation } from './useTranslation';
import { getYDomain, getRadarDomain } from '../utils/dataTransformers';
import {
    getChartColors,
    CHART_MARGINS,
    AXIS_CONFIG,
    RADAR_CONFIG,
    SCATTER_CONFIG,
    CHART_DIMENSIONS
} from '../constants/chartConfig';
import { METRICS } from '../constants/metrics';
import { DATA_KEYS, CHART_MODE } from "../constants/chartConstants";
import { CHART_TYPES } from "../constants/chartTypes";

/**
 * useChart - Ein Hook für wiederverwendbare Chart-Funktionalität
 *
 * @param {Object} options - Die Konfigurationsoptionen
 * @param {string} options.chartType - Der Chart-Typ (scores, weights, combined usw.)
 * @param {string} options.mode - Der Chart-Modus (standard, radar, scatter, workType)
 * @returns {Object} - Chart-bezogene Hilfsfunktionen und Daten
 */
const useChart = ({
                      chartType = CHART_TYPES.SCORES,
                      mode = CHART_MODE.STANDARD
                  }) => {
    const t = useTranslation();
    const chartColors = getChartColors();

    // Einheitliche Chart-Dimensionen basierend auf dem Modus
    const chartDimensions = useMemo(() => {
        switch(mode) {
            case CHART_MODE.RADAR:
                return { height: CHART_DIMENSIONS.RADAR_HEIGHT };
            case CHART_MODE.SCATTER:
                return { height: CHART_DIMENSIONS.CORRELATION_HEIGHT };
            case CHART_MODE.WORK_TYPE:
                return { height: CHART_DIMENSIONS.WORK_TYPE_HEIGHT };
            case CHART_MODE.COMBINED:
                return { height: CHART_DIMENSIONS.DEFAULT_HEIGHT };
            case CHART_MODE.STANDARD:
            default:
                return { height: CHART_DIMENSIONS.DEFAULT_HEIGHT };
        }
    }, [mode]);

    const formatValue = useMemo(() => {
        return (value) => {
            if (value === undefined || value === null) return '';
            return Number(value).toFixed(METRICS.DEFAULT_DECIMAL_PLACES);
        };
    }, []);

    // Erweiterte yDomain-Logik
    const yDomain = useMemo(() => {
        if (mode === CHART_MODE.RADAR) return getRadarDomain(chartType);
        if (mode === CHART_MODE.SCATTER) return [0, 100];
        return getYDomain(chartType);
    }, [chartType, mode]);

    // Spezifische Chart-Margins basierend auf dem Modus
    const margins = useMemo(() => {
        switch(mode) {
            case CHART_MODE.RADAR:
                return CHART_MARGINS.NO_MARGIN;
            case CHART_MODE.SCATTER:
                return CHART_MARGINS.CORRELATION;
            case CHART_MODE.WORK_TYPE:
                return CHART_MARGINS.WORK_TYPE_BAR;
            default:
                return CHART_MARGINS.DEFAULT;
        }
    }, [mode]);

    // Tooltip-Konfiguration für verschiedene Chart-Typen
    const tooltipConfig = useMemo(() => {
        if (chartType === CHART_TYPES.WORK_TYPE_ANALYSIS) {
            return {
                formatter: formatValue,
                labelFormatter: (data) => {
                    return `${data.type} (${t('count', 'tableHeaders')}: ${data.count})`;
                }
            };
        }
        else if (chartType === CHART_TYPES.STATISTICS && mode === CHART_MODE.SCATTER) {
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
                    return data[DATA_KEYS.SHORT_NAME] || data[DATA_KEYS.NAME] ||
                        data[DATA_KEYS.SHORT_SUBJECT] || data[DATA_KEYS.SUBJECT] || '';
                }
            };
        }
    }, [chartType, formatValue, mode, t]);

    const defaultLegendProps = useMemo(() => {
        return {
            verticalAlign: "top",
            height: 36
        };
    }, []);

    // Gemeinsame Konfiguration für Barchart, Linechart usw.
    const commonChartConfig = useMemo(() => {
        return {
            margin: margins
        };
    }, [margins]);

    // Achsen-Konfiguration
    const axisConfig = useMemo(() => {
        return {
            xAxis: {
                dataKey: DATA_KEYS.SHORT_NAME,
                ...AXIS_CONFIG.DEFAULT_X
            },
            yAxis: {
                domain: yDomain,
                tickFormatter: formatValue
            }
        };
    }, [yDomain, formatValue]);

    // Radar-spezifische Konfiguration
    const radarConfig = useMemo(() => {
        return mode === CHART_MODE.RADAR ? {
            outerRadius: RADAR_CONFIG.OUTER_RADIUS,
            margin: CHART_MARGINS.NO_MARGIN,
            polarAngleAxis: {
                dataKey: DATA_KEYS.SHORT_SUBJECT,
                tick: { fontSize: 10 }
            },
            polarRadiusAxis: {
                angle: 90,
                domain: yDomain
            },
            radar: {
                strokeWidth: RADAR_CONFIG.STROKE_WIDTH,
                fillOpacity: RADAR_CONFIG.FILL_OPACITY,
                dot: {
                    r: RADAR_CONFIG.DOT_RADIUS,
                    strokeWidth: RADAR_CONFIG.DOT_STROKE_WIDTH,
                    fill: "white"
                }
            }
        } : null;
    }, [mode, yDomain]);

    // Scatter-spezifische Konfiguration
    const scatterConfig = useMemo(() => {
        return mode === CHART_MODE.SCATTER ? {
            zRange: SCATTER_CONFIG.Z_RANGE,
            dot: {
                r: SCATTER_CONFIG.DOT_RADIUS
            }
        } : null;
    }, [mode]);

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