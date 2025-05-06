import React, { memo } from 'react';
import { ComposedChart, Bar, Line, YAxis } from 'recharts';
import BaseChartComponent from './BaseChartComponent';
import useChart from '../../hooks/useChart';
import { renderCartesianBase } from '../../utils/chartUtils';
import {CHART_TYPES, DATA_KEYS} from "../../constants/chartConstants";

const ComposedChartComponent = memo(({ data, analysisType, title }) => {
    const {
        t,
        chartDimensions,
        chartColors,
        commonChartConfig,
        axisConfig,
        tooltipConfig,
        defaultLegendProps
    } = useChart({ analysisType, chartType: CHART_TYPES.COMBINED });

    return (
        <BaseChartComponent title={title} height={chartDimensions.height}>
            <ComposedChart
                data={data}
                margin={commonChartConfig.margin}
            >
                {renderCartesianBase(axisConfig, tooltipConfig, defaultLegendProps)}
                <YAxis yAxisId="right" orientation="right" domain={[0, 25]} />
                <Bar yAxisId="left" dataKey={DATA_KEYS.AI_SCORE} name={t('aiScore', 'labels')} fill={chartColors.PRIMARY} />
                <Bar yAxisId="left" dataKey={DATA_KEYS.HUMAN_SCORE} name={t('humanScore', 'labels')} fill={chartColors.SECONDARY} />
                <Line yAxisId="right" type="monotone" dataKey={DATA_KEYS.AI_WEIGHT} name={t('aiWeight', 'labels')} stroke={chartColors.TERTIARY} strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey={DATA_KEYS.HUMAN_WEIGHT} name={t('humanWeight', 'labels')} stroke={chartColors.QUATERNARY} strokeWidth={2} />
            </ComposedChart>
        </BaseChartComponent>
    );
});

export default ComposedChartComponent;