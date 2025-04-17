import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import './styles/charts.css';
import { getYDomain } from '../../utils/dataTransformers';


const LineChartComponent = ({ data, chartType }) => {
    return (
        <ResponsiveContainer width="100%" height={250}>
            <LineChart
                data={data}
                margin={{ top: 5, right: 30, left: 0, bottom: 30 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="shortName"
                    angle={-45}
                    textAnchor="end"
                    height={70}
                    tick={{ fontSize: 10 }}
                />
                <YAxis
                    domain={getYDomain(chartType)}
                />
                <Tooltip />
                <Legend />
                <Line
                    type="monotone"
                    dataKey={Object.keys(data[0])[2]} // KI/AI
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                />
                <Line
                    type="monotone"
                    dataKey={Object.keys(data[0])[3]} // Human
                    stroke="#82ca9d"
                    activeDot={{ r: 8 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default LineChartComponent;