// src/components/charts/workTypeAnalysis/TypeDifferenceChartComponent.jsx
import React, { memo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';
import { CHART_MARGINS, getChartColors } from '../../../constants/chartConfig';
import CustomTooltip from '../CustomTooltip';
import BaseChartComponent from '../BaseChartComponent';
import useChart from "../../../hooks/useChart";

const TypeDifferenceChartComponent = memo(({ data, getDifferenceColor, tooltipFormatter }) => {
    const {
        t,
        defaultLegendProps
    } = useChart({  });

    return (
        <div className="chart-wrapper">
            <BaseChartComponent height={300}>
                <BarChart data={data} margin={CHART_MARGINS.WORK_TYPE_BAR}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip formatter={tooltipFormatter} />} />
                    <Legend {...defaultLegendProps} />
                    <Bar
                        dataKey="averageDifference"
                        name={t('avgDifference', 'metrics')}
                        fill={getChartColors().PRIMARY}
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={getDifferenceColor(entry.averageDifference)}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </BaseChartComponent>
        </div>
    );
});

export default TypeDifferenceChartComponent;