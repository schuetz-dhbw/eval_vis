import React from 'react';
import {
    ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import {CHART_MARGINS, AXIS_CONFIG, CHART_DIMENSIONS} from '../../constants/chartConfig';
import useChart from "../../hooks/useChart";
import BaseChartComponent from "./BaseChartComponent";


const ComposedChartComponent = ({ data, chartType }) => {
    const {
        t,
        CHART_COLORS,
        defaultLegendProps
    } = useChart({ data, chartType });

    return (
        <BaseChartComponent height={CHART_DIMENSIONS.DEFAULT_HEIGHT} width={CHART_DIMENSIONS.FULL_WIDTH}>
            <ComposedChart
                data={data}
                margin={CHART_MARGINS.DEFAULT}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="shortName"
                    {...AXIS_CONFIG.DEFAULT_X}
                />
                <YAxis yAxisId="left" domain={[0, 100]} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 25]} />
                <Tooltip />
                <Legend {...defaultLegendProps}  />
                <Bar yAxisId="left" dataKey={`${t('ai', 'labels')}Score`} name={t('aiScore', 'labels')} fill={CHART_COLORS.PRIMARY} />
                <Bar yAxisId="left" dataKey={`${t('human', 'labels')}Score`} name={t('humanScore', 'labels')} fill={CHART_COLORS.SECONDARY} />
                <Line yAxisId="right" type="monotone" dataKey={`${t('ai', 'labels')}Weight`} name={t('aiWeight', 'labels')} stroke={CHART_COLORS.TERTIARY} />
                <Line yAxisId="right" type="monotone" dataKey={`${t('human', 'labels')}Weight`} name={t('humanWeight', 'labels')} stroke={CHART_COLORS.QUATERNARY} />
            </ComposedChart>
        </BaseChartComponent>
    );
};

export default ComposedChartComponent;