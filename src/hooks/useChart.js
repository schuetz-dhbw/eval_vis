import { useMemo } from 'react';
import { useTranslation } from './useTranslation';
import { getYDomain, getRadarDomain } from '../utils/dataTransformers';
import { getChartColors, CHART_MARGINS, AXIS_CONFIG, RADAR_CONFIG } from '../constants/chartConfig';
import { METRICS } from '../constants/metrics';
import {DATA_KEYS} from "../constants/chartConstants";

/**
 * useChart - Ein Hook für wiederverwendbare Chart-Funktionalität
 *
 * @param {Object} options - Die Konfigurationsoptionen
 * @param {Array} options.data - Die Chart-Daten
 * @param {string} options.chartType - Der Chart-Typ (scores, weights, combined usw.)
 * @param {boolean} options.isRadar - Ob es sich um ein Radar-Chart handelt (Optional)
 * @returns {Object} - Chart-bezogene Hilfsfunktionen und Daten
 */
const useChart = ({ data = [], chartType, isRadar = false }) => {
    const t = useTranslation();
    const CHART_COLORS = getChartColors();

    const formatValue = useMemo(() => {
        return (value) => {
            if (value === undefined || value === null) return '';
            return Number(value).toFixed(METRICS.DEFAULT_DECIMAL_PLACES);
        };
    }, []);

    const yDomain = useMemo(() => {
        return isRadar ? getRadarDomain(chartType) : getYDomain(chartType);
    }, [chartType, isRadar]);

    const tooltipConfig = useMemo(() => {
        return {
            formatter: formatValue,
            labelFormatter: (data) => {
                return data[DATA_KEYS.SHORT_NAME] || data[DATA_KEYS.NAME] ||
                    data[DATA_KEYS.SHORT_SUBJECT] || data[DATA_KEYS.SUBJECT] || '';
            }
        };
    }, [formatValue]);

    const defaultLegendProps = useMemo(() => {
        return {
            verticalAlign: "top",
            height: 36
        };
    }, []);

    // Gemeinsame Konfiguration für Barchart, Linechart usw.
    const commonChartConfig = useMemo(() => {
        return {
            margin: CHART_MARGINS.DEFAULT,
            data
        };
    }, [data]);

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

    return {
        t,
        CHART_COLORS,
        formatValue,
        yDomain,
        tooltipConfig,
        defaultLegendProps,
        commonChartConfig,
        axisConfig,
        radarConfig
    };
};

export default useChart;