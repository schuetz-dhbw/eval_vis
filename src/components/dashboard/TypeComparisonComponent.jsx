import React from 'react';
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import BaseChartComponent from '../charts/BaseChartComponent';
import CustomTooltip from '../charts/CustomTooltip';
import useChart from "../../hooks/useChart";
import {CHART_TYPES} from "../../constants/chartConstants";
import {renderDashboardTypeComparisonBars} from "../../utils/chartUtils";

const TypeComparisonComponent = ({ data, analysisType }) => {
    const {
        t,
        chartDimensions,
        chartColors,
        commonChartConfig
    } = useChart({
        analysisType,
        chartType: CHART_TYPES.BAR
    });

    console.log("Type translation test:",
        t('analytic', 'works.types'),
        t('constructive', 'works.types'),
        t('analytic', 'types'),
        t('constructive', 'types')
    );

    console.log("Data passed to TypeComparisonChart:", data);

    return (
        <BaseChartComponent height={chartDimensions.height}>
            <BarChart
                data={data}
                margin={commonChartConfig.margin}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="type"
                    tickFormatter={(value) => t(value, 'works.types')}
                />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {renderDashboardTypeComparisonBars(t, data, chartColors)}
            </BarChart>
        </BaseChartComponent>
    );
};

export default TypeComparisonComponent;