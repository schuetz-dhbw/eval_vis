import React from 'react';
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import BaseChartComponent from '../charts/BaseChartComponent';
import CustomTooltip from '../charts/CustomTooltip';
import useChart from "../../hooks/useChart";
import {CHART_TYPES} from "../../constants/chartConstants";
import {renderDashboardTypeComparisonBars} from "../../utils/chartUtils";

const TypeComparisonChart = ({ data, analysisType }) => {
    const {
        t,
        chartDimensions,
        chartColors,
        commonChartConfig
    } = useChart({
        analysisType,
        chartType: CHART_TYPES.BAR
    });

    return (
        <BaseChartComponent height={chartDimensions.height}>
            <BarChart
                data={data}
                margin={commonChartConfig.margin}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {renderDashboardTypeComparisonBars(t, data, chartColors)}
            </BarChart>
        </BaseChartComponent>
    );
};

export default TypeComparisonChart;