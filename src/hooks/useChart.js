import { useMemo } from 'react';
import { useTranslation } from './useTranslation';
import { getYDomain, getRadarDomain } from '../utils/dataTransformers';
import { getChartColors } from '../constants/chartConfig';
import { METRICS } from '../constants/metrics';

/**
 * useChart - Ein Hook für wiederverwendbare Chart-Funktionalität
 *
 * @param {Object} options - Die Konfigurationsoptionen
 * @param {Array} options.data - Die Chart-Daten
 * @param {string} options.chartType - Der Chart-Typ (scores, weights, combined usw.)
 * @returns {Object} - Chart-bezogene Hilfsfunktionen und Daten
 */
const useChart = ({ data, chartType }) => {
    // language Parameter entfernt
    const t = useTranslation(); // Ohne Parameter
    const CHART_COLORS = getChartColors();

    // Rest des Hooks bleibt gleich
    const formatValue = (value) => {
        return Number(value).toFixed(METRICS.DEFAULT_DECIMAL_PLACES);
    };

    const yDomain = useMemo(() => {
        return getYDomain(chartType);
    }, [chartType]);

    const radarDomain = useMemo(() => {
        return getRadarDomain(chartType);
    }, [chartType]);

    const tooltipFormatter = (value) => formatValue(value);

    const tooltipConfig = {
        formatter: tooltipFormatter
    };

    const defaultLegendProps = {
        verticalAlign: "top",
        height: 36
    };

    return {
        t,
        CHART_COLORS,
        formatValue,
        yDomain,
        radarDomain,
        tooltipConfig,
        defaultLegendProps
    };
};

export default useChart;