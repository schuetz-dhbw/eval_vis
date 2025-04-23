import React, { useMemo } from 'react';
import './styles/statistics.css';
import { useTranslation } from '../../hooks/useTranslation';
import CorrelationAnalysisComponent from '../charts/CorrelationAnalysisComponent';
import { calculateStatistics, calculateSimilarityMetrics } from '../../utils/dataTransformers';
import ChartErrorBoundary from '../charts/ChartErrorBoundary';
import DataErrorBoundary from '../common/DataErrorBoundary';
import ErrorBoundary from '../common/ErrorBoundary';
import {useAppContext} from "../../AppContext";
import {METRICS} from "../../constants/metrics";

const StatisticsSection = () => {
    const { currentWork, language } = useAppContext();
    const t = useTranslation(language);

    // Statistiken mit useMemo berechnen
    const stats = useMemo(() => {
        return calculateStatistics(currentWork);
    }, [currentWork]);

    // Ähnlichkeitsmetriken ebenfalls mit useMemo
    const metrics = useMemo(() => {
        return calculateSimilarityMetrics(currentWork);
    }, [currentWork]);

    // Format a number to 2 decimal places
    const formatNum = (num) => num.toFixed(METRICS.DEFAULT_DECIMAL_PLACES);

    return (
        <ErrorBoundary
            fallbackTitle={t('dataErrorTitle', 'errors')}
            fallbackMessage={t('dataErrorMessage', 'errors')}
            showDetails={false}
        >
            <div className="statistics-container">
                <h3 className="section-title">{t('statistics', 'chartTypes')}</h3>

                <div className="stats-row">
                    <div className="stat-box">
                        <h4 className="stat-title">{t('avgDifference', 'metrics') || "Average Score Difference"}</h4>
                        <div className="stat-value">{formatNum(stats.avgDifference)}%</div>
                        <p className="stat-description">
                            {t('maxDiff', 'metrics') || "Max"}: {formatNum(stats.maxDifference)}% | { }
                            {t('minDiff', 'metrics') || "Min"}: {formatNum(stats.minDifference)}%
                        </p>
                    </div>

                    <div className="stat-box">
                        <h4 className="stat-title">{t('standardDeviation', 'metrics') || "Standard Deviation"}</h4>
                        <div className="stat-value">
                            {t('ai', 'labels')}: {formatNum(stats.aiStdDev)}
                        </div>
                        <p className="stat-description">
                            {t('human', 'labels')}: {formatNum(stats.humanStdDev)}
                        </p>
                    </div>

                    <div className="stat-box">
                        <h4 className="stat-title">{t('weightDifference', 'metrics') || "Weight Difference"}</h4>
                        <div className="stat-value">{formatNum(stats.avgWeightDiff * 100)}%</div>
                        <p className="stat-description">
                            {t('cosine', 'metrics')}: {metrics.similarity.toFixed(4)}
                        </p>
                    </div>
                </div>

                <div className="statistics-content">
                    <DataErrorBoundary data={currentWork} language={language}>
                        <ChartErrorBoundary language={language}>
                            <CorrelationAnalysisComponent
                                work={currentWork}
                                language={language}
                            />
                        </ChartErrorBoundary>
                    </DataErrorBoundary>
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default StatisticsSection;