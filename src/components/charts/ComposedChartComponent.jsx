import React, { memo } from 'react';
import { ComposedChart, Bar, Line, YAxis } from 'recharts';
import BaseChartComponent from './BaseChartComponent';
import useChart from '../../hooks/useChart';
import { renderCartesianBase } from '../../utils/chartUtils';
import { DATA_KEYS } from "../../constants/chartConstants";

const ComposedChartComponent = memo(({ data, chartType, title }) => {
    const {
        t,
        CHART_COLORS,
        commonChartConfig,
        axisConfig,
        tooltipConfig,
        defaultLegendProps
    } = useChart({ chartType });

    return (
        <BaseChartComponent title={title}>
            <ComposedChart
                data={data}
                margin={commonChartConfig.margin}
            >
                {renderCartesianBase(axisConfig, tooltipConfig, defaultLegendProps)}
                <YAxis yAxisId="right" orientation="right" domain={[0, 25]} />
                <Bar yAxisId="left" dataKey={DATA_KEYS.AI_SCORE} name={t('aiScore', 'labels')} fill={CHART_COLORS.PRIMARY} />
                <Bar yAxisId="left" dataKey={DATA_KEYS.HUMAN_SCORE} name={t('humanScore', 'labels')} fill={CHART_COLORS.SECONDARY} />
                <Line yAxisId="right" type="monotone" dataKey={DATA_KEYS.AI_WEIGHT} name={t('aiWeight', 'labels')} stroke={CHART_COLORS.TERTIARY} />
                <Line yAxisId="right" type="monotone" dataKey={DATA_KEYS.HUMAN_WEIGHT} name={t('humanWeight', 'labels')} stroke={CHART_COLORS.QUATERNARY} />
            </ComposedChart>
        </BaseChartComponent>
    );
});

export default ComposedChartComponent;