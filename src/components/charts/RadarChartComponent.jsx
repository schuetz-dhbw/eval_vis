import React from 'react';
import {
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip
} from 'recharts';
import BaseChartComponent from './BaseChartComponent';
import useChart from '../../hooks/useChart';
import { CHART_DIMENSIONS } from '../../constants/chartConfig';
import CustomTooltip from "./CustomTooltip";
import {DATA_KEYS} from "../../constants/chartConstants";

const RadarChartComponent = ({ data, chartType, title }) => {
    const {
        t,
        CHART_COLORS,
        tooltipConfig,
        radarConfig
    } = useChart({ data, chartType, isRadar: true });

    return (
        <BaseChartComponent height={CHART_DIMENSIONS.RADAR_HEIGHT} title={title}>
            <RadarChart
                data={data}
                outerRadius={radarConfig.outerRadius}
                margin={radarConfig.margin}>
                <PolarGrid />
                <PolarAngleAxis
                    {...radarConfig.polarAngleAxis}
                />
                <PolarRadiusAxis
                    {...radarConfig.polarRadiusAxis}
                />
                <Radar
                    name={t('ai', 'labels')}
                    dataKey={DATA_KEYS.AI}
                    stroke={CHART_COLORS.PRIMARY}
                    strokeWidth={radarConfig.radar.strokeWidth}
                    fill={CHART_COLORS.PRIMARY}
                    fillOpacity={radarConfig.radar.fillOpacity}
                    dot={{
                        ...radarConfig.radar.dot,
                        stroke: CHART_COLORS.PRIMARY
                    }}
                />
                <Radar
                    name={t('human', 'labels')}
                    dataKey={DATA_KEYS.HUMAN}
                    stroke={CHART_COLORS.SECONDARY}
                    strokeWidth={radarConfig.radar.strokeWidth}
                    fill={CHART_COLORS.SECONDARY}
                    fillOpacity={radarConfig.radar.fillOpacity}
                    dot={{
                        ...radarConfig.radar.dot,
                        stroke: CHART_COLORS.SECONDARY
                    }}
                />
                <Tooltip
                    content={<CustomTooltip
                        formatter={tooltipConfig.formatter}
                        labelFormatter={tooltipConfig.labelFormatter}
                    />}
                />
                <Legend />
            </RadarChart>
        </BaseChartComponent>
    );
};

export default RadarChartComponent;