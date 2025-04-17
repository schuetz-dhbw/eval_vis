import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import './styles/charts.css';
import { getYDomain } from '../../utils/dataTransformers';
import { useTranslation } from '../../hooks/useTranslation';

const BarChartComponent = ({ data, chartType, language }) => {
    const t = useTranslation(language);

    const formatValue = (value) => {
        return Number(value).toFixed(1);
    };

    return (
        <ResponsiveContainer width="100%" height={250}>
            <BarChart
                data={data}
                margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 30,
                }}
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
                    tickFormatter={formatValue}
                />
                <Tooltip
                    formatter={(value) => formatValue(value)}
                />
                <Legend />
                <Bar dataKey={t('ki', 'labels')} fill="#8884d8" />
                <Bar dataKey={t('human', 'labels')} fill="#82ca9d" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default BarChartComponent;