import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import './styles/charts.css';
import { getYDomain } from '../../utils/dataTransformers';
import { getTranslation } from '../../utils/translationHelpers';


const BarChartComponent = ({ data, chartType, translations, language }) => {
    const t = (key, section = null) => getTranslation(translations, language, key, section);

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
                <YAxis domain={getYDomain(chartType)} />
                <Tooltip />
                <Legend />
                <Bar dataKey={t('ki', 'labels')} fill="#8884d8" />
                <Bar dataKey={t('human', 'labels')} fill="#82ca9d" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default BarChartComponent;