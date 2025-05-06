import React, { memo, useMemo } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { calculateSimilarityMetrics } from '../../utils/dataTransformers';
import { SIMILARITY_THRESHOLDS, DISTANCE_THRESHOLDS, GRADE_DIFFERENCE_THRESHOLDS } from '../../constants/thresholds';
import { useAppContext } from '../../AppContext';

const MetricsSection = memo(() => {
    const { currentWork } = useAppContext();
    const t = useTranslation();

    // Metriken berechnen mit useMemo
    const metrics = useMemo(() => {
        return calculateSimilarityMetrics(currentWork);
    }, [currentWork]); // Nur neu berechnen, wenn sich work ändert

    return (
        <div className="component-container">
            <h3 className="section-title">{t('metricsTitle', 'chartTitles') || "Similarity Metrics"}</h3>
            <div className="component-grid grid-3-cols">
                <div className="info-box">
                    <div className="data-value">{metrics.similarity.toFixed(3)}</div>
                    <div className="data-label">{t('cosine', 'metrics')}</div>
                    <div className="item-description">
                        {t('cosineDescription', 'metricsDescriptions') ||
                            "Measures angle similarity between KI and human ratings (1.0 = identical, 0.0 = completely different)"}
                    </div>
                    <div className="quality-indicator">
                        {metrics.similarity > SIMILARITY_THRESHOLDS.EXCELLENT ? '✓ ' + (t('excellent', 'metricsQuality') || "Excellent") :
                            metrics.similarity > SIMILARITY_THRESHOLDS.GOOD ? '✓ ' + (t('good', 'metricsQuality') || "Good") :
                                metrics.similarity > SIMILARITY_THRESHOLDS.MODERATE ? '⚠ ' + (t('moderate', 'metricsQuality') || "Moderate") :
                                    '⚠ ' + (t('poor', 'metricsQuality') || "Poor")}
                    </div>
                </div>
                <div className="info-box">
                    <div className="data-value">{metrics.distance.toFixed(2)}</div>
                    <div className="data-label">{t('distance', 'metrics')}</div>
                    <div className="item-description">
                        {t('distanceDescription', 'metricsDescriptions') ||
                            "Euclidean distance between KI and human ratings (lower = more similar)"}
                    </div>
                    <div className="quality-indicator">
                        {metrics.distance < DISTANCE_THRESHOLDS.EXCELLENT ? '✓ ' + (t('excellent', 'metricsQuality') || "Excellent") :
                            metrics.distance < DISTANCE_THRESHOLDS.GOOD ? '✓ ' + (t('good', 'metricsQuality') || "Good") :
                                metrics.distance < DISTANCE_THRESHOLDS.MODERATE ? '⚠ ' + (t('moderate', 'metricsQuality') || "Moderate") :
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
                            "Difference between KI and human final grades"}
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