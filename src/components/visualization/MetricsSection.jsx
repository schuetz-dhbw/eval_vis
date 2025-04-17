import React, { useMemo } from 'react';
import './styles/metrics.css';
import { useTranslation } from '../../hooks/useTranslation';
import { calculateSimilarityMetrics } from '../../utils/dataTransformers';
import { CHART_TYPES } from '../../data/chartTypes';

const MetricsSection = ({ work, language, chartType }) => {
    const t = useTranslation(language);

    // Metriken berechnen mit useMemo
    const metrics = useMemo(() => {
        return calculateSimilarityMetrics(work);
    }, [work]); // Nur neu berechnen, wenn sich work ändert

    //TODO: Bewertung / Einordnung diskutieren
    return (
        <div className="metrics-container">
            <h3 className="chart-title">{t('metricsTitle', 'chartTitles') || "Similarity Metrics"}</h3>
            <div className="metrics-grid">
                <div className="metric-box">
                    <div className="metric-value">{metrics.similarity.toFixed(3)}</div>
                    <div className="metric-label">{t('cosine', 'metrics')}</div>
                    <div className="metric-description">
                        {t('cosineDescription', 'metricsDescriptions') ||
                            "Measures angle similarity between KI and human ratings (1.0 = identical, 0.0 = completely different)"}
                    </div>
                    <div className="metric-quality">
                        {metrics.similarity > 0.9 ? '✓ ' + (t('excellent', 'metricsQuality') || "Excellent") :
                            metrics.similarity > 0.7 ? '✓ ' + (t('good', 'metricsQuality') || "Good") :
                                metrics.similarity > 0.5 ? '⚠ ' + (t('moderate', 'metricsQuality') || "Moderate") :
                                    '⚠ ' + (t('poor', 'metricsQuality') || "Poor")}
                    </div>
                </div>
                <div className="metric-box">
                    <div className="metric-value">{metrics.distance.toFixed(2)}</div>
                    <div className="metric-label">{t('distance', 'metrics')}</div>
                    <div className="metric-description">
                        {t('distanceDescription', 'metricsDescriptions') ||
                            "Euclidean distance between KI and human ratings (lower = more similar)"}
                    </div>
                    <div className="metric-quality">
                        {metrics.distance < 50 ? '✓ ' + (t('excellent', 'metricsQuality') || "Excellent") :
                            metrics.distance < 100 ? '✓ ' + (t('good', 'metricsQuality') || "Good") :
                                metrics.distance < 150 ? '⚠ ' + (t('moderate', 'metricsQuality') || "Moderate") :
                                    '⚠ ' + (t('poor', 'metricsQuality') || "Poor")}
                    </div>
                </div>
                <div className="metric-box">
                    <div className="metric-value">{work.aiGrade.toFixed(1)} / {work.humanGrade.toFixed(1)}</div>
                    <div className="metric-label">{t('gradeDifference', 'metrics') || "Grade Difference"}</div>
                    <div className="metric-description">
                        {t('gradeDifferenceDescription', 'metricsDescriptions') ||
                            "Difference between KI and human final grades"}
                    </div>
                    <div className="metric-quality">
                        {Math.abs(work.aiGrade - work.humanGrade) < 0.4 ? '✓ ' + (t('excellent', 'metricsQuality') || "Excellent") :
                            Math.abs(work.aiGrade - work.humanGrade) < 0.6 ? '✓ ' + (t('good', 'metricsQuality') || "Good") :
                                Math.abs(work.aiGrade - work.humanGrade) < 1.1 ? '⚠ ' + (t('moderate', 'metricsQuality') || "Moderate") :
                                    '⚠ ' + (t('poor', 'metricsQuality') || "Poor")}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MetricsSection;