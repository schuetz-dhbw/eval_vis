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
 * @param {string} options.language - Die aktuelle Sprache
 * @returns {Object} - Chart-bezogene Hilfsfunktionen und Daten
 */
const useChart = ({ data, chartType, language }) => {
    const t = useTranslation(language);
    const CHART_COLORS = getChartColors();

    // Formatiere Werte entsprechend der Standardeinstellungen
    const formatValue = (value) => {
        return Number(value).toFixed(METRICS.DEFAULT_DECIMAL_PLACES);
    };

    // Berechne Y-Achsen-Domain basierend auf dem Chart-Typ
    const yDomain = useMemo(() => {
        return getYDomain(chartType);
    }, [chartType]);

    // Berechne Radar-Domain basierend auf dem Chart-Typ
    const radarDomain = useMemo(() => {
        return getRadarDomain(chartType);
    }, [chartType]);

    // Standardfunktionen für Tooltips
    const tooltipFormatter = (value) => formatValue(value);

    // Standardkonfiguration für Tooltip
    const tooltipConfig = {
        formatter: tooltipFormatter
    };

    // Standardkonfiguration für Legende
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