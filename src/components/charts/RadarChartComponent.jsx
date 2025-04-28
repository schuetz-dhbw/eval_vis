import React, { memo } from 'react';
import { RadarChart, Radar } from 'recharts';
import BaseChartComponent from './BaseChartComponent';
import useChart from '../../hooks/useChart';
import { CHART_DIMENSIONS } from '../../constants/chartConfig';
import { renderRadarBase } from '../../utils/chartUtils';
import { DATA_KEYS } from "../../constants/chartConstants";

const RadarChartComponent = memo(({ data, chartType, title }) => {
    const {
        t,
        CHART_COLORS,
        tooltipConfig,
        radarConfig
    } = useChart({ chartType, isRadar: true });

    return (
        <BaseChartComponent height={CHART_DIMENSIONS.RADAR_HEIGHT} title={title}>
            <RadarChart
                data={data}
                outerRadius={radarConfig.outerRadius}
                margin={radarConfig.margin}
            >
                {renderRadarBase(radarConfig, tooltipConfig)}
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
            </RadarChart>
        </BaseChartComponent>
    );
});

export default RadarChartComponent;