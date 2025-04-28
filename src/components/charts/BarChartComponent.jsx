import React, { memo } from 'react';
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import BaseChartComponent from './BaseChartComponent';
import useChart from '../../hooks/useChart';
import CustomTooltip from "./CustomTooltip";
import { renderBars } from '../../utils/chartUtils';

const BarChartComponent = memo(({ data, chartType, title }) => {
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
            <BarChart
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
                {renderBars(t, CHART_COLORS)}
            </BarChart>
        </BaseChartComponent>
    );
});

export default BarChartComponent;