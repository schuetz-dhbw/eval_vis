import React, { memo } from 'react';
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import BaseChartComponent from './BaseChartComponent';
import useChart from '../../hooks/useChart';
import CustomTooltip from "./CustomTooltip";
import { renderBars } from '../../utils/chartUtils';
import {CHART_TYPES} from "../../constants/chartConstants";

const BarChartComponent = memo(({ data, analysisType, title }) => {
    const {
        t,
        chartDimensions,
        chartColors,
        commonChartConfig,
        axisConfig,
        tooltipConfig,
        defaultLegendProps
    } = useChart({ analysisType, chartType: CHART_TYPES.BAR });

    return (
        <BaseChartComponent title={title} height={chartDimensions.height}>
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
                {renderBars(t, chartColors)}
            </BarChart>
        </BaseChartComponent>
    );
});

export default BarChartComponent;