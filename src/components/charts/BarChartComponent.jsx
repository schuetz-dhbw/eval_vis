import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { CHART_DIMENSIONS, CHART_MARGINS, AXIS_CONFIG, getChartColors } from '../../constants/chartConfig';
import './styles/charts.css';
import { getYDomain } from '../../utils/dataTransformers';
import { useTranslation } from '../../hooks/useTranslation';
import {METRICS} from "../../constants/metrics";

const BarChartComponent = ({ data, chartType, language }) => {
    const t = useTranslation(language);
    const CHART_COLORS = getChartColors();

    const formatValue = (value) => {
        return Number(value).toFixed(METRICS.DEFAULT_DECIMAL_PLACES);
    };

    return (
        <ResponsiveContainer width={CHART_DIMENSIONS.FULL_WIDTH} height={CHART_DIMENSIONS.DEFAULT_HEIGHT}>
            <BarChart
                data={data}
                margin={CHART_MARGINS.BAR_CHART}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="shortName"
                    {...AXIS_CONFIG.DEFAULT_X}
                />
                <YAxis
                    domain={getYDomain(chartType)}
                    tickFormatter={formatValue}
                />
                <Tooltip
                    formatter={(value) => formatValue(value)}
                />
                <Legend />
                <Bar
                    dataKey={t('ki', 'labels')}
                    fill={CHART_COLORS.PRIMARY} />
                <Bar
                    dataKey={t('human', 'labels')}
                    fill={CHART_COLORS.SECONDARY} />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default BarChartComponent;