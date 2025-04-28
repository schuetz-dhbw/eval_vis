import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import BaseChartComponent from './BaseChartComponent';
import useChart from '../../hooks/useChart';
import CustomTooltip from "./CustomTooltip";

const LineChartComponent = ({ data, chartType, title }) => {
    const {
        t,
        CHART_COLORS,
        commonChartConfig,
        axisConfig,
        tooltipConfig,
        defaultLegendProps
    } = useChart({ data, chartType });

    return (
        <BaseChartComponent title={title}>
            <LineChart {...commonChartConfig}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis {...axisConfig.xAxis} />
                <YAxis {...axisConfig.yAxis} />
                <Tooltip
                    content={<CustomTooltip
                        formatter={tooltipConfig.formatter}
                        labelFormatter={tooltipConfig.labelFormatter}
                    />}
                />
                <Legend {...defaultLegendProps} />
                <Line
                    type="monotone"
                    dataKey="ai"
                    name={t('ai', 'labels')}
                    stroke={CHART_COLORS.PRIMARY}
                    activeDot={{ r: 8 }}
                />
                <Line
                    type="monotone"
                    dataKey="human"
                    name={t('human', 'labels')}
                    stroke={CHART_COLORS.SECONDARY}
                    activeDot={{ r: 8 }}
                />
            </LineChart>
        </BaseChartComponent>
    );
};

export default LineChartComponent;