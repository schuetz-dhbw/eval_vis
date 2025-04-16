import React from 'react';
import {
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer
} from 'recharts';
import './styles/charts.css';
import { getRadarDomain } from '../../utils/dataTransformers';
import { getTranslation } from '../../utils/translationHelpers';


const RadarChartComponent = ({ data, chartType, translations, language }) => {
    const t = (key, section = null) => getTranslation(translations, language, key, section);

    return (
        <ResponsiveContainer width="100%" height={350}>
            <RadarChart outerRadius="75%" data={data}>
                <PolarGrid />
                <PolarAngleAxis
                    dataKey="shortSubject"
                    tick={{ fontSize: 10 }}
                />
                <PolarRadiusAxis
                    angle={90}
                    domain={getRadarDomain(chartType)}
                />
                <Radar
                    name={t('ki', 'labels')}
                    dataKey={t('ki', 'labels')}
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                />
                <Radar
                    name={t('human', 'labels')}
                    dataKey={t('human', 'labels')}
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    fillOpacity={0.6}
                />
                <Legend />
            </RadarChart>
        </ResponsiveContainer>
    );
};

export default RadarChartComponent;