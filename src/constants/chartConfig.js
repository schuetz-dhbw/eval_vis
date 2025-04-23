import { getCSSVariable } from '../utils/cssHelpers';

export const CHART_DIMENSIONS = {
    DEFAULT_HEIGHT: 250,
    RADAR_HEIGHT: 350,
    WORK_TYPE_HEIGHT: 300,
    FULL_WIDTH: '100%'
};

export const CHART_MARGINS = {
    DEFAULT: { top: 5, right: 30, left: 0, bottom: 30 },
    BAR_CHART: { top: 10, right: 30, left: 0, bottom: 30 },
    COMPOSED_CHART: { top: 5, right: 30, left: 0, bottom: 30 },
    RADAR_CHART: { top: 0, right: 0, left: 0, bottom: 0 },
    WORK_TYPE_BAR: { top: 20, right: 30, left: 20, bottom: 50 },
    SCATTER_CHART: { top: 20, right: 30, bottom: 60, left: 20 }
};

export const AXIS_CONFIG = {
    DEFAULT_X: {
        angle: -45,
        textAnchor: 'end',
        height: 70,
        tick: { fontSize: 10 }
    },
    WORK_TYPE_X: {
        angle: -45,
        textAnchor: 'end',
        height: 100,
        tick: { fontSize: 10 }
    }
};

export const RADAR_CONFIG = {
    OUTER_RADIUS: '75%',
    STROKE_WIDTH: 2.5,
    FILL_OPACITY: 0.1,
    DOT_RADIUS: 5,
    DOT_STROKE_WIDTH: 1
};

export const getChartColors = () => ({
    PRIMARY: getCSSVariable('--color-primary'),
    SECONDARY: getCSSVariable('--color-secondary'),
    TERTIARY: getCSSVariable('--color-tertiary'),
    QUATERNARY: getCSSVariable('--color-quaternary')
});