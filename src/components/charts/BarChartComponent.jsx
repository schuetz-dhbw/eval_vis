import React, {memo} from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import BaseChartComponent from './BaseChartComponent';
import useChart from '../../hooks/useChart';
import CustomTooltip from "./CustomTooltip";
import {DATA_KEYS} from "../../constants/chartConstants";

const BarChartComponent = memo(({ data, chartType, title }) => {
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
            <BarChart {...commonChartConfig}>
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
                <Bar
                    dataKey={DATA_KEYS.AI}
                    name={t('ai', 'labels')}
                    fill={CHART_COLORS.PRIMARY} />
                <Bar
                    dataKey={DATA_KEYS.HUMAN}
                    name={t('human', 'labels')}
                    fill={CHART_COLORS.SECONDARY} />
            </BarChart>
        </BaseChartComponent>
    );
});

export default BarChartComponent;