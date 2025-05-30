import React, { useMemo } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import CriteriaAnalysisComponent from '../charts/CriteriaAnalysisComponent';
import { calculateStatistics, calculateSimilarityMetrics } from '../../utils/dataTransformers';
import ChartErrorBoundary from '../charts/ChartErrorBoundary';
import DataErrorBoundary from '../common/DataErrorBoundary';
import ErrorBoundary from '../common/ErrorBoundary';
import {useAppContext} from "../../AppContext";
import {METRICS} from "../../constants/metrics";

import {ANALYSIS_TYPES} from "../../constants/chartConstants";

const CriteriaAnalysisSection = () => {
    const { currentWork } = useAppContext();
    const t = useTranslation();

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
            <div className="component-container">
                <h3 className="section-title">{t('statistics', 'analysisTypes')}</h3>

                <div className="component-grid grid-3-cols">
                    <div className="info-box">
                        <h4 className="data-label">{t('avgDifference', 'metrics')}</h4>
                        <div className="data-value">{formatNum(stats.avgDifference)}%</div>
                        <p className="item-description">
                            {t('maxDiff', 'metrics') || "Max"}: {formatNum(stats.maxDifference)}% | { }
                            {t('minDiff', 'metrics') || "Min"}: {formatNum(stats.minDifference)}%
                        </p>
                    </div>

                    <div className="info-box">
                        <h4 className="data-label">{t('standardDeviation', 'metrics')}</h4>
                        <div className="data-value">
                            {t('ai', 'labels')}: {formatNum(stats.aiStdDev)}
                        </div>
                        <p className="item-description">
                            {t('human', 'labels')}: {formatNum(stats.humanStdDev)}
                        </p>
                    </div>

                    <div className="info-box">
                        <h4 className="data-label">{t('weightDifference', 'metrics')}</h4>
                        <div className="data-value">{formatNum(stats.avgWeightDiff * 100)}%</div>
                        <p className="item-description">
                            {t('cosine', 'metrics')}: {metrics.similarity.toFixed(4)}
                        </p>
                    </div>
                </div>

                <div className="flex-column">
                    <DataErrorBoundary data={currentWork}>
                        <ChartErrorBoundary>
                            <CriteriaAnalysisComponent
                                work={currentWork}
                                analysisType={ANALYSIS_TYPES.STATISTICS}
                            />
                        </ChartErrorBoundary>
                    </DataErrorBoundary>
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default CriteriaAnalysisSection;