import React from 'react';
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import BaseChartComponent from '../charts/BaseChartComponent';
import CustomTooltip from '../charts/CustomTooltip';
import { renderDashboardCriteriaBars} from '../../utils/chartUtils';
import useChart from "../../hooks/useChart";
import {CHART_TYPES} from "../../constants/chartConstants";

const CriteriaComparisonChart = ({ data, analysisType }) => {
    const {
        t,
        chartDimensions,
        chartColors,
        commonChartConfig
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

    // Nur die Top 10 Kriterien mit höchster Differenz anzeigen
    const topCriteria = chartData.slice(0, 10);

    return (
        <BaseChartComponent height={chartDimensions.height * 3}>
            <BarChart
                data={topCriteria}
                margin={commonChartConfig.margin}
                layout="vertical"
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {renderDashboardCriteriaBars(t, chartColors, topCriteria)}
            </BarChart>
        </BaseChartComponent>
    );
};

export default CriteriaComparisonChart;