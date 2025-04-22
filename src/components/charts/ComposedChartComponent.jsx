import React from 'react';
import {
    ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {CHART_MARGINS, AXIS_CONFIG, CHART_DIMENSIONS, getChartColors} from '../../constants/chartConfig';
import './styles/charts.css';
import { useTranslation } from '../../hooks/useTranslation';


const ComposedChartComponent = ({ data, language }) => {
    const t = useTranslation(language);
    const CHART_COLORS = getChartColors();

    return (
        <ResponsiveContainer width={CHART_DIMENSIONS.FULL_WIDTH} height={CHART_DIMENSIONS.DEFAULT_HEIGHT}>
            <ComposedChart
                data={data}
                margin={CHART_MARGINS.COMPOSED_CHART}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="shortName"
                    {...AXIS_CONFIG.DEFAULT_X}
                />
                <YAxis yAxisId="left" domain={[0, 100]} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 25]} />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey={`${t('ki', 'labels')}Score`} name={t('kiScore', 'labels')} fill={CHART_COLORS.PRIMARY} />
                <Bar yAxisId="left" dataKey={`${t('human', 'labels')}Score`} name={t('humanScore', 'labels')} fill={CHART_COLORS.SECONDARY} />
                <Line yAxisId="right" type="monotone" dataKey={`${t('ki', 'labels')}Weight`} name={t('aiWeight', 'labels')} stroke={CHART_COLORS.TERTIARY} />
                <Line yAxisId="right" type="monotone" dataKey={`${t('human', 'labels')}Weight`} name={t('humanWeight', 'labels')} stroke={CHART_COLORS.QUATERNARY} />
            </ComposedChart>
        </ResponsiveContainer>
    );
};

export default ComposedChartComponent;