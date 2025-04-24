import { useMemo } from 'react';
import { useTranslation } from './useTranslation';
import { getYDomain } from '../utils/dataTransformers';
import { getChartColors } from '../constants/chartConfig';
import { METRICS } from '../constants/metrics';

/**
 * useChart - Ein Hook für wiederverwendbare Chart-Funktionalität
 *
 * @param {Object} options - Die Konfigurationsoptionen
 * @param {string} options.chartType - Der Chart-Typ (scores, weights, combined usw.)
 * @returns {Object} - Chart-bezogene Hilfsfunktionen und Daten
 */
const useChart = ({ chartType }) => {
    const t = useTranslation();
    const CHART_COLORS = getChartColors();

    const formatValue = useMemo(() => {
        return (value) => {
            return Number(value).toFixed(METRICS.DEFAULT_DECIMAL_PLACES);
        };
    }, []);

    const yDomain = useMemo(() => {
        return getYDomain(chartType);
    }, [chartType]);

    const tooltipFormatter = useMemo(() => {
        return (value) => formatValue(value);
    }, [formatValue]);

    const tooltipConfig = useMemo(() => {
        return {
            formatter: tooltipFormatter
        };
    }, [tooltipFormatter]);

    const defaultLegendProps = useMemo(() => {
        return {
            verticalAlign: "top",
            height: 36
        };
    }, []);

    return {
        t,
        CHART_COLORS,
        formatValue,
        yDomain,
        tooltipConfig,
        defaultLegendProps
    };
};

export default useChart;