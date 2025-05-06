import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { METRICS } from '../../constants/metrics';

const DashboardSummary = ({ metrics }) => {
    const t = useTranslation();

    // Standard-Dezimalstellen verwenden
    const formatValue = (value) => {
        return value.toFixed(METRICS.DEFAULT_DECIMAL_PLACES);
    };

    return (
        <div className="dashboard-summary">
            <div className="component-grid grid-3-cols">
                <div className="info-box">
                    <div className="data-value">{metrics.workCount}</div>
                    <div className="data-label">{t('totalWorks', 'dashboard') || "Total Works"}</div>
                </div>

                <div className="info-box">
                    <div className="data-value">{formatValue(metrics.avgAiGrade)} / {formatValue(metrics.avgHumanGrade)}</div>
                    <div className="data-label">{t('avgGrades', 'dashboard') || "Avg. Grades (AI/Human)"}</div>
                </div>

                <div className="info-box">
                    <div className="data-value">{formatValue(metrics.avgGradeDifference)}</div>
                    <div className="data-label">{t('avgDiff', 'dashboard') || "Avg. Grade Difference"}</div>
                    <div className="item-description">
                        {t('minMaxDiff', 'dashboard') || "Min/Max"}: {formatValue(metrics.minGradeDifference)} - {formatValue(metrics.maxGradeDifference)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardSummary;