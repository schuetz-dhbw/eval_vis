import React, { useMemo } from 'react';
import './styles/metrics.css';
import { getTranslation } from '../../utils/translationHelpers';
import { calculateSimilarityMetrics } from '../../utils/dataTransformers';
import { CHART_TYPES } from '../../data/chartTypes';

const MetricsSection = ({ work, translations, language, chartType }) => {
    const t = (key, section = null) => getTranslation(translations, language, key, section);

    // Metriken berechnen mit useMemo
    const metrics = useMemo(() => {
        return calculateSimilarityMetrics(work);
    }, [work]); // Nur neu berechnen, wenn sich work ändert

    return (
        <div className="metrics-section">
            <div className="metrics">
                <p>
                    <span className="metric-label">{t('cosine', 'metrics')}:</span> {metrics.similarity.toFixed(4)}
                </p>
                <p>
                    <span className="metric-label">{t('distance', 'metrics')}:</span> {metrics.distance.toFixed(3)}
                </p>
            </div>
        </div>
    );
};

export default MetricsSection;