import React, { memo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';
import CustomTooltip from '../CustomTooltip';
import BaseChartComponent from '../BaseChartComponent';
import useChart from "../../../hooks/useChart";
import {CHART_TYPES, ANALYSIS_TYPES} from "../../../constants/chartConstants";

const TypeDifferenceChartComponent = memo(({ data, analysisType = ANALYSIS_TYPES.WORK_TYPE_ANALYSIS }) => {
    const {
        t,
        chartDimensions,
        chartColors,
        commonChartConfig,
        axisConfig,
        tooltipConfig,
        defaultLegendProps
    } = useChart({
        analysisType,
        chartType: CHART_TYPES.BAR
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
                    fill={chartColors.QUINARY}
                >
                    {data.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={chartColors.QUINARY}
                        />
                    ))}
                </Bar>
            </BarChart>
        </BaseChartComponent>
    );
});

export default TypeDifferenceChartComponent;