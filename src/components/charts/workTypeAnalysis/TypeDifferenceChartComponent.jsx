import React, { memo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';
import CustomTooltip from '../CustomTooltip';
import BaseChartComponent from '../BaseChartComponent';
import useChart from "../../../hooks/useChart";
import { getDifferenceColor } from '../../../utils/chartUtils';
import {CHART_TYPES} from "../../../constants/chartTypes";

const TypeDifferenceChartComponent = memo(({
                                               data,
                                               height
                                           }) => {
    const {
        t,
        CHART_COLORS,
        commonChartConfig,
        axisConfig,
        tooltipConfig,
        defaultLegendProps
    } = useChart({ chartType: CHART_TYPES.WORK_TYPE_ANALYSIS });

    return (
        <BaseChartComponent height={height}>
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
                    fill={CHART_COLORS.PRIMARY}
                >
                    {data.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={getDifferenceColor(entry.averageDifference, CHART_COLORS)}
                        />
                    ))}
                </Bar>
            </BarChart>
        </BaseChartComponent>
    );
});

export default TypeDifferenceChartComponent;