import React, { useMemo } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { calculateCosineSimilarity } from '../../utils/dataTransformers';
import { getSimilarityColor} from '../../utils/chartUtils';
import useChart from '../../hooks/useChart';
import { CHART_TYPES } from '../../constants/chartConstants';

const SimilarityTableComponent = ({ works }) => {
    const t = useTranslation();
    const { chartColors } = useChart({
        chartType: CHART_TYPES.BAR
    });

    // Berechne die Kosinus-Ähnlichkeit für jede Arbeit
    const similarityData = useMemo(() => {
        return works.map(work => {
            const similarity = calculateCosineSimilarity(work.aiScores, work.humanScores);
            return {
                key: work.key,
                title: work.title || work.key,
                similarity: similarity,
                // Eine vereinfachte Kategorisierung der Ähnlichkeit
                category: similarity > 0.9 ? 'high' : (similarity > 0.75 ? 'medium' : 'low')
            };
        }).sort((a, b) => b.similarity - a.similarity); // Sortieren nach Ähnlichkeit (absteigend)
    }, [works]);

    console.log(works);

    return (
        <div className="table-container">
            <table className="data-table">
                <thead>
                <tr>
                    <th>{t('work', 'tableHeaders')}</th>
                    <th>{t('similarity', 'dashboard')}</th>
                    <th>{t('category', 'tableHeaders')}</th>
                    <th>{t('visualization', 'dashboard')}</th>
                </tr>
                </thead>
                <tbody>
                {similarityData.map((item, index) => {
                    const backgroundColor = getSimilarityColor(item.similarity * 100, chartColors);
                    const textColor = item.similarity > 0.5 ? "#000000" : "#ffffff";

                    return (
                        <tr key={item.key} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                            <td>{item.title}</td>
                            <td>{item.similarity.toFixed(3)}</td>
                            <td>{t(item.category + 'Similarity', 'dashboard')}</td>
                            <td>
                                <div
                                    className="similarity-indicator"
                                    style={{
                                        backgroundColor,
                                        color: textColor,
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        textAlign: 'center',
                                        width: `${item.similarity * 100}%`,
                                        minWidth: '40px',
                                    }}
                                >
                                    {(item.similarity * 100).toFixed(1)}%
                                </div>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
};

export default SimilarityTableComponent;