import React, { memo, useMemo } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { calculateSimilarityMetrics } from '../../utils/dataTransformers';
import { SIMILARITY_THRESHOLDS, GRADE_DIFFERENCE_THRESHOLDS } from '../../constants/thresholds';
import { useAppContext } from '../../AppContext';

const MetricsSection = memo(() => {
    const { currentWork } = useAppContext();
    const t = useTranslation();

    // Metriken berechnen mit useMemo
    const metrics = useMemo(() => {
        return calculateSimilarityMetrics(currentWork);
    }, [currentWork]); // Nur neu berechnen, wenn sich work ändert

    // Updated thresholds for normalized distance (0-1 scale)
    const normalizedDistanceThresholds = {
        EXCELLENT: 0.15,   // < 15% of theoretical maximum
        GOOD: 0.25,        // < 25% of theoretical maximum
        MODERATE: 0.35     // < 35% of theoretical maximum
    };

    return (
        <div className="component-container">
            <h3 className="section-title">{t('metricsTitle', 'chartTitles') || "Similarity Metrics"}</h3>
            <div className="component-grid grid-3-cols">
                <div className="info-box">
                    <div className="data-value">{metrics.similarity.toFixed(3)}</div>
                    <div className="data-label">{t('cosine', 'metrics')}</div>
                    <div className="item-description">
                        {t('cosineDescription', 'metricsDescriptions') ||
                            "Measures angle similarity between AI and human ratings (1.0 = identical, 0.0 = completely different)"}
                    </div>
                    <div className="quality-indicator">
                        {metrics.similarity > SIMILARITY_THRESHOLDS.EXCELLENT ? '✓ ' + (t('excellent', 'metricsQuality') || "Excellent") :
                            metrics.similarity > SIMILARITY_THRESHOLDS.GOOD ? '✓ ' + (t('good', 'metricsQuality') || "Good") :
                                metrics.similarity > SIMILARITY_THRESHOLDS.MODERATE ? '⚠ ' + (t('moderate', 'metricsQuality') || "Moderate") :
                                    '⚠ ' + (t('poor', 'metricsQuality') || "Poor")}
                    </div>
                </div>
                <div className="info-box">
                    <div className="data-value">{(metrics.normalizedDistance * 100).toFixed(1)}%</div>
                    <div className="data-label">{t('normalizedDistance', 'metrics') || "Normalized Distance"}</div>
                    <div className="item-description">
                        {t('normalizedDistanceDescription', 'metricsDescriptions') ||
                            `Percentage of theoretical maximum disagreement (${metrics.distance.toFixed(1)} / ${metrics.theoreticalMaxDistance.toFixed(1)})`}
                    </div>
                    <div className="quality-indicator">
                        {metrics.normalizedDistance < normalizedDistanceThresholds.EXCELLENT ? '✓ ' + (t('excellent', 'metricsQuality') || "Excellent") :
                            metrics.normalizedDistance < normalizedDistanceThresholds.GOOD ? '✓ ' + (t('good', 'metricsQuality') || "Good") :
                                metrics.normalizedDistance < normalizedDistanceThresholds.MODERATE ? '⚠ ' + (t('moderate', 'metricsQuality') || "Moderate") :
                                    '⚠ ' + (t('poor', 'metricsQuality') || "Poor")}
                    </div>
                </div>
                <div className="info-box">
                    <div className="data-value">
                        {Math.abs(currentWork.aiGrade - currentWork.humanGrade).toFixed(2)}
                    </div>
                    <div className="data-label">{t('gradeDifference', 'metrics') || "Grade Difference"}</div>
                    <div className="item-description">
                        {t('gradeDifferenceDescription', 'metricsDescriptions') ||
                            "Difference between AI and human final grades"}
                    </div>
                    <div className="quality-indicator">
                        {Math.abs(currentWork.aiGrade - currentWork.humanGrade) < GRADE_DIFFERENCE_THRESHOLDS.EXCELLENT ? '✓ ' + (t('excellent', 'metricsQuality') || "Excellent") :
                            Math.abs(currentWork.aiGrade - currentWork.humanGrade) < GRADE_DIFFERENCE_THRESHOLDS.GOOD ? '✓ ' + (t('good', 'metricsQuality') || "Good") :
                                Math.abs(currentWork.aiGrade - currentWork.humanGrade) < GRADE_DIFFERENCE_THRESHOLDS.MODERATE ? '⚠ ' + (t('moderate', 'metricsQuality') || "Moderate") :
                                    '⚠ ' + (t('poor', 'metricsQuality') || "Poor")}
                    </div>
                </div>
            </div>
        </div>
    );
});

export default MetricsSection;