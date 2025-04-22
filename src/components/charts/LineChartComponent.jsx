import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {CHART_MARGINS, AXIS_CONFIG, getChartColors, CHART_DIMENSIONS} from '../../constants/chartConfig';
import './styles/charts.css';
import { getYDomain } from '../../utils/dataTransformers';


const LineChartComponent = ({ data, chartType }) => {

    const CHART_COLORS = getChartColors();

    return (
        <ResponsiveContainer width={CHART_DIMENSIONS.FULL_WIDTH} height={CHART_DIMENSIONS.DEFAULT_HEIGHT}>
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
                <Legend />
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
        </ResponsiveContainer>
    );
};

export default LineChartComponent;