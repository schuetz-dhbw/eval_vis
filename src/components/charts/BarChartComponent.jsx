import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import {CHART_MARGINS, AXIS_CONFIG, CHART_DIMENSIONS} from '../../constants/chartConfig';
import BaseChartComponent from './BaseChartComponent';
import useChart from '../../hooks/useChart';

const BarChartComponent = ({ data, chartType, language }) => {
    const {
        t,
        CHART_COLORS,
        formatValue,
        yDomain,
        tooltipConfig,
        defaultLegendProps
    } = useChart({ data, chartType, language });

    return (
        <BaseChartComponent height={CHART_DIMENSIONS.DEFAULT_HEIGHT} width={CHART_DIMENSIONS.FULL_WIDTH} language={language}>
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
                    domain={yDomain}
                    tickFormatter={formatValue}
                />
                <Tooltip formatter={tooltipConfig.formatter} />
                <Legend {...defaultLegendProps} />
                <Bar
                    dataKey={t('ai', 'labels')}
                    fill={CHART_COLORS.PRIMARY} />
                <Bar
                    dataKey={t('human', 'labels')}
                    fill={CHART_COLORS.SECONDARY} />
            </BarChart>
        </BaseChartComponent>
    );
};

export default BarChartComponent;