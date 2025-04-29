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
import {DATA_KEYS} from "../constants/chartConstants";
import {CHART_TYPES} from "../constants/chartTypes";

/**
 * useChart - Ein Hook für wiederverwendbare Chart-Funktionalität
 *
 * @param {Object} options - Die Konfigurationsoptionen
 * @param {string} options.chartType - Der Chart-Typ (scores, weights, combined usw.)
 * @param {boolean} options.isRadar - Ob es sich um ein Radar-Chart handelt (Optional)
 * @returns {Object} - Chart-bezogene Hilfsfunktionen und Daten
 */
const useChart = ({ chartType, isRadar = false, isScatter = false, isWorkTypeAnalysis = false }) => {
    const t = useTranslation();
    const chartColors = getChartColors();

    // Einheitliche Chart-Dimensionen basierend auf dem Typ
    const chartDimensions = useMemo(() => {
        if (isRadar) return { height: CHART_DIMENSIONS.RADAR_HEIGHT };
        if (isScatter) return { height: CHART_DIMENSIONS.CORRELATION_HEIGHT };
        if (isWorkTypeAnalysis) return { height: CHART_DIMENSIONS.WORK_TYPE_HEIGHT };
        return { height: CHART_DIMENSIONS.DEFAULT_HEIGHT };
    }, [isRadar, isScatter, isWorkTypeAnalysis]);

    const formatValue = useMemo(() => {
        return (value) => {
            if (value === undefined || value === null) return '';
            return Number(value).toFixed(METRICS.DEFAULT_DECIMAL_PLACES);
        };
    }, []);

    // Erweiterte yDomain-Logik
    const yDomain = useMemo(() => {
        if (isRadar) return getRadarDomain(chartType);
        if (isScatter) return [0, 100];
        return getYDomain(chartType);
    }, [chartType, isRadar, isScatter]);

    const tooltipConfig = useMemo(() => {
        if (chartType === CHART_TYPES.WORK_TYPE_ANALYSIS) {
            return {
                formatter: formatValue,
                labelFormatter: (data) => {
                    return `${data.type} (${t('count', 'tableHeaders')}: ${data.count})`;
                }
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
    }, [chartType, formatValue, t]);

    const defaultLegendProps = useMemo(() => {
        return {
            verticalAlign: "top",
            height: 36
        };
    }, []);

    // Gemeinsame Konfiguration für Barchart, Linechart usw.
    const commonChartConfig = useMemo(() => {
        return {
            margin: CHART_MARGINS.DEFAULT
        };
    }, []);

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
        return {
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
        };
    }, [yDomain]);

    const scatterConfig = useMemo(() => {
        return {
            zRange: SCATTER_CONFIG.Z_RANGE,
            dot: {
                r: SCATTER_CONFIG.DOT_RADIUS
            }
        };
    }, []);

    return {
        t,
        chartDimensions,
        chartColors: chartColors,
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