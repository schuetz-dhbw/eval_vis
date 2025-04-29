// src/constants/chartConfig.js - Ändern
import { getCSSVariable } from '../utils/cssHelpers';

// Wiederverwendbare Chart-Dimensionen
export const CHART_DIMENSIONS = {
    DEFAULT_HEIGHT: 250,
    RADAR_HEIGHT: 350,
    WORK_TYPE_HEIGHT: 300,
    CORRELATION_HEIGHT: 400,
    HEATMAP_HEIGHT: 400,
    FULL_WIDTH: '100%'
};

// Standard-Margins für verschiedene Chart-Typen
export const CHART_MARGINS = {
    DEFAULT: { top: 5, right: 10, left: 0, bottom: 20 },
    NO_MARGIN: { top: 0, right: 0, left: 0, bottom: 0 }, // Radar
    WORK_TYPE_BAR: { top: 15, right: 10, left: 0, bottom: 10 },
    CORRELATION: { top: 5, right: 10, left: 10, bottom: 20 }
};

// Standard-Achsenkonfigurationen
export const AXIS_CONFIG = {
    DEFAULT_X: {
        angle: -45,
        textAnchor: 'end',
        height: 70,
        tick: { fontSize: 10 }
    },
    DEFAULT_Y: {
        tickFormatter: value => Number(value).toFixed(2),
        width: 60
    },
    SCATTER_X: {
        type: 'number',
        domain: [0, 100]
    },
    SCATTER_Y: {
        type: 'number',
        domain: [0, 100]
    }
};

// Radar-Chart-spezifische Konfiguration
export const RADAR_CONFIG = {
    OUTER_RADIUS: '75%',
    STROKE_WIDTH: 2.5,
    FILL_OPACITY: 0.1,
    DOT_RADIUS: 5,
    DOT_STROKE_WIDTH: 1
};

// Scatter-Chart-Konfiguration
export const SCATTER_CONFIG = {
    Z_RANGE: [50, 250],
    DOT_RADIUS: 6
};

// Line-Chart-Konfiguration
export const LINE_CONFIG = {
    STROKE_WIDTH: 2,
    DOT_RADIUS: 5,
    ACTIVEDOT_RADIUS: 8
};

// Holt die aktuellen Chart-Farben basierend auf dem Theme
export const getChartColors = () => ({
    PRIMARY: getCSSVariable('--color-primary'),
    SECONDARY: getCSSVariable('--color-secondary'),
    TERTIARY: getCSSVariable('--color-tertiary'),
    QUATERNARY: getCSSVariable('--color-quaternary'),
    SUCCESS: getCSSVariable('--color-success'),
    WARNING: getCSSVariable('--color-warning'),
    ERROR: getCSSVariable('--color-error')
});

// Konfigurations-Factory für verschiedene Chart-Typen
export const getChartConfig = (chartType) => {
    const colors = getChartColors();

    // Grundlegende Konfiguration
    const baseConfig = {
        colors,
        margin: CHART_MARGINS.DEFAULT,
        animationDuration: 300,
        grid: { strokeDasharray: "3 3" }
    };

    // Chart-Typ-spezifische Konfigurationen
    switch(chartType) {
        case 'radar':
            return {
                ...baseConfig,
                margin: CHART_MARGINS.NO_MARGIN,
                outerRadius: RADAR_CONFIG.OUTER_RADIUS,
                fillOpacity: RADAR_CONFIG.FILL_OPACITY
            };
        case 'scatter':
            return {
                ...baseConfig,
                margin: CHART_MARGINS.CORRELATION,
                zRange: SCATTER_CONFIG.Z_RANGE
            };
        case 'bar':
        case 'line':
        default:
            return baseConfig;
    }
};