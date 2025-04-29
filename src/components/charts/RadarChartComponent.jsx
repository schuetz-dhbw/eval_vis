import React, { memo } from 'react';
import { RadarChart, Radar } from 'recharts';
import BaseChartComponent from './BaseChartComponent';
import useChart from '../../hooks/useChart';
import { renderRadarBase } from '../../utils/chartUtils';
import { DATA_KEYS } from "../../constants/chartConstants";

const RadarChartComponent = memo(({ data, chartType, title }) => {
    const {
        t,
        chartDimensions,
        chartColors,
        tooltipConfig,
        radarConfig
    } = useChart({ chartType, isRadar: true });

    return (
        <BaseChartComponent title={title} height={chartDimensions.height}>
            <RadarChart
                data={data}
                outerRadius={radarConfig.outerRadius}
                margin={radarConfig.margin}
            >
                {renderRadarBase(radarConfig, tooltipConfig)}
                <Radar
                    name={t('ai', 'labels')}
                    dataKey={DATA_KEYS.AI}
                    stroke={chartColors.PRIMARY}
                    strokeWidth={radarConfig.radar.strokeWidth}
                    fill={chartColors.PRIMARY}
                    fillOpacity={radarConfig.radar.fillOpacity}
                    dot={{
                        ...radarConfig.radar.dot,
                        stroke: chartColors.PRIMARY
                    }}
                />
                <Radar
                    name={t('human', 'labels')}
                    dataKey={DATA_KEYS.HUMAN}
                    stroke={chartColors.SECONDARY}
                    strokeWidth={radarConfig.radar.strokeWidth}
                    fill={chartColors.SECONDARY}
                    fillOpacity={radarConfig.radar.fillOpacity}
                    dot={{
                        ...radarConfig.radar.dot,
                        stroke: chartColors.SECONDARY
                    }}
                />
            </RadarChart>
        </BaseChartComponent>
    );
});

export default RadarChartComponent;