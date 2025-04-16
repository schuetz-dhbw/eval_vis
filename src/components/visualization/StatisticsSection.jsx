import React from 'react';
import './styles/statistics.css';
import { getTranslation } from '../../utils/translationHelpers';
import CorrelationAnalysisComponent from '../charts/CorrelationAnalysisComponent';
import { calculateStatistics } from '../../utils/dataTransformers';

const StatisticsSection = ({ work, translations, language }) => {
    const t = (key, section = null) => getTranslation(translations, language, key, section);
    const stats = calculateStatistics(work);

    // Format a number to 2 decimal places
    const formatNum = (num) => num.toFixed(2);

    return (
        <div className="statistics-container">
            <h3 className="section-title">{t('statistics', 'chartTypes')}</h3>

            <div className="stats-row">
                <div className="stat-box">
                    <h4 className="stat-title">{t('avgDifference', 'metrics') || "Average Score Difference"}</h4>
                    <div className="stat-value">{formatNum(stats.avgDifference)}%</div>
                    <p className="stat-description">
                        {t('maxDiff', 'metrics') || "Max"}: {formatNum(stats.maxDifference)}% |
                        {t('minDiff', 'metrics') || "Min"}: {formatNum(stats.minDifference)}%
                    </p>
                </div>

                <div className="stat-box">
                    <h4 className="stat-title">{t('standardDeviation', 'metrics') || "Standard Deviation"}</h4>
                    <div className="stat-value">
                        {t('ki', 'labels')}: {formatNum(stats.kiStdDev)}
                    </div>
                    <p className="stat-description">
                        {t('human', 'labels')}: {formatNum(stats.humanStdDev)}
                    </p>
                </div>

                <div className="stat-box">
                    <h4 className="stat-title">{t('weightDifference', 'metrics') || "Weight Difference"}</h4>
                    <div className="stat-value">{formatNum(stats.avgWeightDiff * 100)}%</div>
                    <p className="stat-description">
                        {t('cosine', 'metrics')}: {work.similarity.toFixed(4)}
                    </p>
                </div>
            </div>

            <div className="statistics-content">
                <CorrelationAnalysisComponent
                    work={work}
                    translations={translations}
                    language={language}
                />
            </div>
        </div>
    );
};

export default StatisticsSection;