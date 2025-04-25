import React from 'react';
import {
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip
} from 'recharts';
import {CHART_DIMENSIONS, CHART_MARGINS, RADAR_CONFIG} from '../../constants/chartConfig';
import { getRadarDomain } from '../../utils/dataTransformers';
import useChart from "../../hooks/useChart";
import BaseChartComponent from "./BaseChartComponent";


const RadarChartComponent = ({ data, chartType }) => {
    const {
        t,
        CHART_COLORS,
        tooltipConfig
    } = useChart({ data, chartType });

    return (
        <BaseChartComponent height={CHART_DIMENSIONS.RADAR_HEIGHT} width={CHART_DIMENSIONS.FULL_WIDTH} >
            <RadarChart
                outerRadius={RADAR_CONFIG.OUTER_RADIUS}
                margin={CHART_MARGINS.NO_MARGIN}
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
                    name={t('ai', 'labels')}
                    dataKey={t('ai', 'labels')}
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
                <Tooltip formatter={tooltipConfig.formatter} />
                <Legend />
            </RadarChart>
        </BaseChartComponent>
    );
};

export default RadarChartComponent;