import React, { memo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';
import CustomTooltip from '../CustomTooltip';
import BaseChartComponent from '../BaseChartComponent';
import useChart from "../../../hooks/useChart";
import { getDifferenceColor } from '../../../utils/chartUtils';
import { CHART_TYPES } from "../../../constants/chartTypes";
import {CHART_MODE} from "../../../constants/chartConstants";

const TypeDifferenceChartComponent = memo(({ data, chartType = CHART_TYPES.WORK_TYPE_ANALYSIS }) => {
    const {
        t,
        chartDimensions,
        chartColors,
        commonChartConfig,
        axisConfig,
        tooltipConfig,
        defaultLegendProps
    } = useChart({
        chartType,
        mode: CHART_MODE.WORK_TYPE
    });

    return (
        <BaseChartComponent height={chartDimensions.height}>
            <BarChart data={data} margin={commonChartConfig.margin}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" {...axisConfig.xAxis} />
                <YAxis {...axisConfig.yAxis} domain={[0, (dataMax) => Math.ceil(dataMax / 10) * 10]} />
                <Tooltip content={<CustomTooltip
                    formatter={tooltipConfig.formatter}
                    labelFormatter={tooltipConfig.labelFormatter}
                />} />
                <Legend {...defaultLegendProps} />
                <Bar
                    dataKey="averageDifference"
                    name={t('avgDifference', 'metrics')}
                    fill={chartColors.PRIMARY}
                >
                    {data.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={getDifferenceColor(entry.averageDifference, chartColors)}
                        />
                    ))}
                </Bar>
            </BarChart>
        </BaseChartComponent>
    );
});

export default TypeDifferenceChartComponent;