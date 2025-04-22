import React from 'react';
import {
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer
} from 'recharts';
import './styles/charts.css';
import {getChartColors, CHART_DIMENSIONS, RADAR_CONFIG} from '../../constants/chartConfig';
import { getRadarDomain } from '../../utils/dataTransformers';
import { useTranslation } from '../../hooks/useTranslation';


const RadarChartComponent = ({ data, chartType, language }) => {
    const t = useTranslation(language);
    const CHART_COLORS = getChartColors();

    return (
        <ResponsiveContainer width={CHART_DIMENSIONS.FULL_WIDTH} height={CHART_DIMENSIONS.RADAR_HEIGHT}>
            <RadarChart
                outerRadius={RADAR_CONFIG.OUTER_RADIUS}
                data={data}>
                <PolarGrid />
                <PolarAngleAxis
                    dataKey="shortSubject"
                    tick={{ fontSize: 10 }}
                />
                <PolarRadiusAxis
                    angle={90}
                    domain={getRadarDomain(chartType)}
                />
                <Radar
                    name={t('ki', 'labels')}
                    dataKey={t('ki', 'labels')}
                    stroke={CHART_COLORS.PRIMARY}
                    strokeWidth={RADAR_CONFIG.STROKE_WIDTH}
                    fill={CHART_COLORS.PRIMARY}
                    fillOpacity={RADAR_CONFIG.FILL_OPACITY}
                    dot={{
                        r: RADAR_CONFIG.DOT_RADIUS,
                        strokeWidth: RADAR_CONFIG.DOT_STROKE_WIDTH,
                        stroke: CHART_COLORS.PRIMARY,
                        fill: "white",
                        strokeDasharray: "",
                    }}
                />
                <Radar
                    name={t('human', 'labels')}
                    dataKey={t('human', 'labels')}
                    stroke={CHART_COLORS.SECONDARY}
                    strokeWidth={RADAR_CONFIG.STROKE_WIDTH}
                    fill={CHART_COLORS.SECONDARY}
                    fillOpacity={RADAR_CONFIG.FILL_OPACITY}
                    dot={{
                        r: RADAR_CONFIG.DOT_RADIUS,
                        strokeWidth: RADAR_CONFIG.DOT_STROKE_WIDTH,
                        stroke: CHART_COLORS.SECONDARY,
                        fill: "white",
                        strokeDasharray: "",
                    }}
                />
                <Legend />
            </RadarChart>
        </ResponsiveContainer>
    );
};

export default RadarChartComponent;