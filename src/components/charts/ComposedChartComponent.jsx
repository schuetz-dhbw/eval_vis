import React from 'react';
import {
    ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import './styles/charts.css';
import { getTranslation } from '../../utils/translationHelpers';


const ComposedChartComponent = ({ data, translations, language }) => {
    const t = (key, section = null) => getTranslation(translations, language, key, section);

    return (
        <ResponsiveContainer width="100%" height={250}>
            <ComposedChart
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
                <YAxis yAxisId="left" domain={[0, 100]} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 25]} />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey={`${t('ki', 'labels')}Score`} name={t('kiScore', 'labels')} fill="#8884d8" />
                <Bar yAxisId="left" dataKey={`${t('human', 'labels')}Score`} name={t('humanScore', 'labels')} fill="#82ca9d" />
                <Line yAxisId="right" type="monotone" dataKey={`${t('ki', 'labels')}Weight`} name={t('kiWeight', 'labels')} stroke="#ff7300" />
                <Line yAxisId="right" type="monotone" dataKey={`${t('human', 'labels')}Weight`} name={t('humanWeight', 'labels')} stroke="#0088fe" />
            </ComposedChart>
        </ResponsiveContainer>
    );
};

export default ComposedChartComponent;