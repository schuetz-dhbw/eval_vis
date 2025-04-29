import React from 'react';
import { CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, Bar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import CustomTooltip from '../components/charts/CustomTooltip';
import { DATA_KEYS } from "../constants/chartConstants";

// Gemeinsame Elemente für kartesische Charts (BarChart, LineChart, ComposedChart)
export const renderCartesianBase = (axisConfig, tooltipConfig, defaultLegendProps) => {
    return [
        <CartesianGrid key="grid" strokeDasharray="3 3" />,
        <XAxis key="xAxis" {...axisConfig.xAxis} />,
        <YAxis key="yAxis" yAxisId="left" {...axisConfig.yAxis} />,
        <Tooltip
            key="tooltip"
            content={<CustomTooltip
                formatter={tooltipConfig.formatter}
                labelFormatter={tooltipConfig.labelFormatter}
            />}
        />,
        <Legend key="legend" {...defaultLegendProps} />
    ];
};

// Hilfsfunktion zum Rendern von Bars
export const renderBars = (t, CHART_COLORS) => {
    return [
        <Bar
            key="ai-bar"
            dataKey={DATA_KEYS.AI}
            name={t('ai', 'labels')}
            fill={CHART_COLORS.PRIMARY}
        />,
        <Bar
            key="human-bar"
            dataKey={DATA_KEYS.HUMAN}
            name={t('human', 'labels')}
            fill={CHART_COLORS.SECONDARY}
        />
    ];
};

// Hilfsfunktion zum Rendern von Lines
export const renderLines = (t, CHART_COLORS) => {
    return [
        <Line
            key="ai-line"
            type="monotone"
            dataKey={DATA_KEYS.AI}
            name={t('ai', 'labels')}
            stroke={CHART_COLORS.PRIMARY}
            activeDot={{ r: 8 }}
        />,
        <Line
            key="human-line"
            type="monotone"
            dataKey={DATA_KEYS.HUMAN}
            name={t('human', 'labels')}
            stroke={CHART_COLORS.SECONDARY}
            activeDot={{ r: 8 }}
        />
    ];
};

// Für Radar-Charts
export const renderRadarBase = (radarConfig, tooltipConfig) => {
    return [
        <PolarGrid key="polarGrid" />,
        <PolarAngleAxis key="angleAxis" {...radarConfig.polarAngleAxis} />,
        <PolarRadiusAxis key="radiusAxis" {...radarConfig.polarRadiusAxis} />,
        <Tooltip
            key="tooltip"
            content={<CustomTooltip
                formatter={tooltipConfig.formatter}
                labelFormatter={tooltipConfig.labelFormatter}
            />}
        />,
        <Legend key="legend" />
    ];
};

export const renderScatterChartBase = (t, dataKeys, tooltipConfig, defaultLegendProps) => {
    return [
        <CartesianGrid key="grid" strokeDasharray="3 3" />,
        <XAxis
            key="xAxis"
            type="number"
            dataKey={dataKeys.xDataKey}
            name={t('ai', 'labels')}
            domain={[0, 100]}
            label={{
                value: t('ai', 'labels') + ' ' + t('score', 'labels'),
                position: 'bottom',
                offset: 0
            }}
        />,
        <YAxis
            key="yAxis"
            type="number"
            dataKey={dataKeys.yDataKey}
            name={t('human', 'labels')}
            domain={[0, 100]}
            label={{
                value: t('human', 'labels') + ' ' + t('score', 'labels'),
                angle: -90,
                position: 'insideLeft',
                offset: 10,
                style: { textAnchor: 'middle' }
            }}
        />,
        <Tooltip
            key="tooltip"
            content={<CustomTooltip
                formatter={tooltipConfig.formatter}
                labelFormatter={tooltipConfig.labelFormatter}
            />}
        />,
        <Legend key="legend" {...defaultLegendProps} />
    ];
};

export const getDifferenceColor = (value, CHART_COLORS) => {
    if (value > 30) return CHART_COLORS.TERTIARY;  // Großer Unterschied
    if (value > 15) return CHART_COLORS.PRIMARY;   // Mittlerer Unterschied
    return CHART_COLORS.SECONDARY;                 // Kleiner Unterschied
};

// Hilfsfunktion für einheitliche Cell-Styling in Heatmaps und Korrelationsmatrizen
export const getIntensityClass = (value, thresholds = { high: 0.7, medium: 0.3 }) => {
    const absValue = Math.abs(parseFloat(value));
    if (absValue > thresholds.high) return 'high-intensity';
    if (absValue > thresholds.medium) return 'medium-intensity';
    return 'low-intensity';
};