import React, { memo } from 'react';
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import BaseChartComponent from './BaseChartComponent';
import useChart from '../../hooks/useChart';
import CustomTooltip from "./CustomTooltip";
import { renderLines } from '../../utils/chartUtils';
import {CHART_MODE} from "../../constants/chartConstants";

const LineChartComponent = memo(({ data, chartType, title }) => {
    const {
        t,
        chartDimensions,
        chartColors,
        commonChartConfig,
        axisConfig,
        tooltipConfig,
        defaultLegendProps
    } = useChart({ chartType, mode: CHART_MODE.STANDARD });

    return (
        <BaseChartComponent title={title} height={chartDimensions.height}>
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
                {renderLines(t, chartColors)}
            </LineChart>
        </BaseChartComponent>
    );
});

export default LineChartComponent;