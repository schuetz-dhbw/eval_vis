import React, { memo } from 'react';
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import BaseChartComponent from './BaseChartComponent';
import useChart from '../../hooks/useChart';
import CustomTooltip from "./CustomTooltip";
import { renderLines } from '../../utils/chartUtils';

const LineChartComponent = memo(({ data, chartType, title }) => {
    const {
        t,
        CHART_COLORS,
        commonChartConfig,
        axisConfig,
        tooltipConfig,
        defaultLegendProps
    } = useChart({ chartType });

    return (
        <BaseChartComponent title={title}>
            <LineChart
                data={data}
                margin={commonChartConfig.margin}
            >
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
                {renderLines(t, CHART_COLORS)}
            </LineChart>
        </BaseChartComponent>
    );
});

export default LineChartComponent;