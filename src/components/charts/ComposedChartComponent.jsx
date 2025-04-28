import React from 'react';
import {
    ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import BaseChartComponent from './BaseChartComponent';
import useChart from '../../hooks/useChart';
import CustomTooltip from "./CustomTooltip";

const ComposedChartComponent = ({ data, chartType, title }) => {
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
            <ComposedChart {...commonChartConfig}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis {...axisConfig.xAxis} />
                <YAxis yAxisId="left" domain={[0, 100]} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 25]} />
                <Tooltip
                    content={<CustomTooltip
                        formatter={tooltipConfig.formatter}
                        labelFormatter={tooltipConfig.labelFormatter}
                    />}
                />
                <Legend {...defaultLegendProps} />
                <Bar yAxisId="left" dataKey="aiScore" name={t('aiScore', 'labels')} fill={CHART_COLORS.PRIMARY} />
                <Bar yAxisId="left" dataKey="humanScore" name={t('humanScore', 'labels')} fill={CHART_COLORS.SECONDARY} />
                <Line yAxisId="right" type="monotone" dataKey="aiWeight" name={t('aiWeight', 'labels')} stroke={CHART_COLORS.TERTIARY} />
                <Line yAxisId="right" type="monotone" dataKey="humanWeight" name={t('humanWeight', 'labels')} stroke={CHART_COLORS.QUATERNARY} />            </ComposedChart>
        </BaseChartComponent>
    );
};

export default ComposedChartComponent;