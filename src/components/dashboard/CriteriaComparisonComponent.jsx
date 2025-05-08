import React from 'react';
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import BaseChartComponent from '../charts/BaseChartComponent';
import CustomTooltip from '../charts/CustomTooltip';
import { renderDashboardCriteriaBars} from '../../utils/chartUtils';
import useChart from "../../hooks/useChart";
import {CHART_TYPES} from "../../constants/chartConstants";

const CriteriaComparisonComponent = ({ data, analysisType }) => {
    const {
        t,
        chartDimensions,
        chartColors,
        commonChartConfig,
        defaultLegendProps
    } = useChart({
        analysisType,
        chartType: CHART_TYPES.BAR
    });

    // Transformiere und übersetze die Daten für die Chart mit dem useTranslation Hook
    const chartData = data.map(item => ({
        name: t(item.key, 'works.criteriaLabels'),
        key: item.key,
        ai: item.ai,
        human: item.human,
        diff: item.diff,
        count: item.count
    }));

    return (
        <BaseChartComponent height={chartDimensions.height * 4}>
            <BarChart
                data={chartData}
                margin={commonChartConfig.margin}
                layout="vertical"
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend {...defaultLegendProps}/>
                {renderDashboardCriteriaBars(t, chartColors, chartData)}
            </BarChart>
        </BaseChartComponent>
    );
};

export default CriteriaComparisonComponent;