import React, { useMemo } from 'react';
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Cell } from 'recharts';
import BaseChartComponent from '../charts/BaseChartComponent';
import useChart from '../../hooks/useChart';
import { CHART_TYPES } from '../../constants/chartConstants';
import { calculateCosineSimilarity } from '../../utils/dataTransformers';
import { getSimilarityColor} from '../../utils/chartUtils';
import { useTranslation } from '../../hooks/useTranslation';

const SimilarityBarChartComponent = ({ works }) => {
    const t = useTranslation();
    const {
        chartColors,
        chartDimensions,
        commonChartConfig
    } = useChart({
        chartType: CHART_TYPES.BAR
    });

    // Berechne die Kosinus-Ähnlichkeit für jede Arbeit
    const chartData = useMemo(() => {
        return works.map(work => {
            const similarity = calculateCosineSimilarity(work.aiScores, work.humanScores);
            return {
                name: work.title || work.key,
                similarity: similarity,
                // Normalisierte Similarity für die Darstellung (0-100%)
                value: similarity * 100
            };
        }).sort((a, b) => b.similarity - a.similarity); // Sortieren nach Ähnlichkeit (absteigend)
    }, [works]);

    return (
        <BaseChartComponent height={chartDimensions.height * 5}>
            <BarChart
                data={chartData}
                margin={commonChartConfig.margin}
                layout="vertical"
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis
                    dataKey="name"
                    type="category"
                    width={150}
                    tick={{ fontSize: 12 }}
                />
                <Tooltip
                    formatter={(value) => [`${value.toFixed(1)}%`, t('cosineSimilarity', 'dashboard')]}
                    labelFormatter={(name) => name}
                />
                <Bar
                    dataKey="value"
                    name={t('cosineSimilarity', 'dashboard')}
                >
                    {chartData.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={getSimilarityColor(entry.similarity * 100, chartColors)}
                        />
                    ))}
                </Bar>
            </BarChart>
        </BaseChartComponent>
    );
};

export default SimilarityBarChartComponent;