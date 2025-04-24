import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import {CHART_MARGINS, AXIS_CONFIG, CHART_DIMENSIONS} from '../../constants/chartConfig';
import './styles/charts.css';
import { getYDomain } from '../../utils/dataTransformers';
import useChart from "../../hooks/useChart";
import BaseChartComponent from "./BaseChartComponent";


const LineChartComponent = ({ data, chartType }) => {
    const {
        CHART_COLORS,
        defaultLegendProps
    } = useChart({ data, chartType });


    return (
        <BaseChartComponent height={CHART_DIMENSIONS.DEFAULT_HEIGHT} width={CHART_DIMENSIONS.FULL_WIDTH}>
            <LineChart
                data={data}
                margin={CHART_MARGINS.DEFAULT}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="shortName"
                    {...AXIS_CONFIG.DEFAULT_X}
                />
                <YAxis
                    domain={getYDomain(chartType)}
                />
                <Tooltip />
                <Legend {...defaultLegendProps} />
                <Line
                    type="monotone"
                    dataKey={Object.keys(data[0])[2]} // KI/AI
                    stroke={CHART_COLORS.PRIMARY}
                    activeDot={{ r: 8 }}
                />
                <Line
                    type="monotone"
                    dataKey={Object.keys(data[0])[3]} // Human
                    stroke={CHART_COLORS.SECONDARY}
                    activeDot={{ r: 8 }}
                />
            </LineChart>
        </BaseChartComponent>
    );
};

export default LineChartComponent;