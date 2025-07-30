import React, {useMemo} from 'react';
import { getSimilarityColor} from '../../utils/chartUtils';
import useChart from '../../hooks/useChart';
import { CHART_TYPES, ANALYSIS_TYPES } from '../../constants/chartConstants';
import {calculateSimilarityMetrics} from "../../utils/dataTransformers";
import {QUALITY_THRESHOLDS} from "../../constants/metrics";

const SimilarityTableComponent = ({ works }) => {
    const {
        t,
        chartColors
    } = useChart({
        analysisType: ANALYSIS_TYPES.DASHBOARD,
        chartType: CHART_TYPES.BAR
    });

    const similarityData = useMemo(() => {
        return works.map(work => {
            // Wir nutzen die bestehende Funktion calculateSimilarityMetrics
            const metrics = calculateSimilarityMetrics(work);
            const similarity = metrics.similarity;
            const normalizedDistance = metrics.normalizedDistance;

            // Kategorie basierend auf den definierten Schwellenwerten
            let category;
            if (similarity > QUALITY_THRESHOLDS.COSINE.EXCELLENT) {
                category = 'high';
            } else if (similarity > QUALITY_THRESHOLDS.COSINE.GOOD) {
                category = 'medium';
            }
            else {
                category = 'low';
            }

            return {
                key: work.key,
                title: work.title || work.key,
                similarity: similarity,
                value: similarity * 100,
                distance: metrics.distance,
                normalizedDistance: normalizedDistance,
                normalizedDistancePercent: normalizedDistance * 100,
                category: category
            };
        }).sort((a, b) => b.similarity - a.similarity);
    }, [works]);

    return (
        <div className="table-container">
            <table className="data-table">
                <thead>
                <tr>
                    <th>{t('work', 'dashboard')}</th>
                    <th>{t('similarity', 'dashboard')}</th>
                    <th>{t('normalizedDistance', 'metrics') || 'Normalized Distance'}</th>
                    <th>{t('euclideanDistance', 'dashboard') || 'Raw Distance'}</th>
                    <th>{t('category', 'dashboard')}</th>
                    <th>{t('visualization', 'dashboard')}</th>
                </tr>
                </thead>
                <tbody>
                {similarityData.map((item, index) => {
                    const backgroundColor = getSimilarityColor(item.similarity * 100, chartColors, {high: 90, medium: 80});

                    // Use normalized distance for more intuitive color coding
                    const distanceColor = getSimilarityColor((1 - item.normalizedDistance) * 100, chartColors, {high: 85, medium: 75});

                    return (
                        <tr key={item.key} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                            <td>{item.title}</td>
                            <td>{item.similarity.toFixed(3)}</td>
                            <td style={{ color: distanceColor, fontWeight: 'bold' }}>
                                {item.normalizedDistancePercent.toFixed(1)}%
                            </td>
                            <td style={{ fontSize: '0.9em', color: 'var(--color-text-light)' }}>
                                {item.distance.toFixed(1)}
                            </td>
                            <td>{t(item.category + 'Similarity', 'dashboard')}</td>
                            <td>
                                <div
                                    className="similarity-indicator"
                                    style={{
                                        backgroundColor,
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        textAlign: 'center',
                                        width: `${item.similarity * 100}%`,
                                        minWidth: '40px',
                                        color: 'white',
                                        fontSize: '0.85em'
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