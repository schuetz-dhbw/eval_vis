import React, {useMemo} from 'react';
import useChart from '../../hooks/useChart';
import { CHART_TYPES, ANALYSIS_TYPES } from '../../constants/chartConstants';
import {calculateSimilarityMetrics} from "../../utils/dataTransformers";
import {QUALITY_THRESHOLDS} from "../../constants/metrics"; // ADD this import

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
            const metrics = calculateSimilarityMetrics(work);
            const similarity = metrics.similarity;
            const normalizedDistance = metrics.normalizedDistance; // Remove * 100

            return {
                key: work.key,
                title: work.title || work.key,
                similarity: similarity,
                normalizedDistance: normalizedDistance
            };
        }).sort((a, b) => b.similarity - a.similarity);
    }, [works]);

    // Helper function to get color based on cosine similarity
    const getCosineColor = (value) => {
        if (value > QUALITY_THRESHOLDS.COSINE.EXCELLENT) return chartColors.OPTIMAL;
        if (value >= QUALITY_THRESHOLDS.COSINE.GOOD) return chartColors.MODERATE;
        return chartColors.CRITICAL;
    };

    // Helper function to get color based on normalized distance
    const getDistanceColor = (value) => {
        if (value < QUALITY_THRESHOLDS.DISTANCE.EXCELLENT) return chartColors.OPTIMAL;
        if (value <= QUALITY_THRESHOLDS.DISTANCE.GOOD) return chartColors.MODERATE;
        return chartColors.CRITICAL;
    };

    return (
        <div className="table-container">
            <table className="data-table">
                <thead>
                <tr>
                    <th>{t('work', 'dashboard')}</th>
                    <th>{t('cosineSimilarity', 'dashboard')}</th>
                    <th>{t('normalizedDistance', 'metrics')}</th>
                </tr>
                </thead>
                <tbody>
                {similarityData.map((item, index) => (
                    <tr key={item.key} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                        <td>{item.title}</td>
                        <td style={{
                            color: getCosineColor(item.similarity),
                            fontWeight: 'bold'
                        }}>
                            {item.similarity.toFixed(3)}
                        </td>
                        <td style={{
                            color: getDistanceColor(item.normalizedDistance),
                            fontWeight: 'bold'
                        }}>
                            {item.normalizedDistance.toFixed(3)}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default SimilarityTableComponent;