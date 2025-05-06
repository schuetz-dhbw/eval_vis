import React, { useMemo } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useAppContext } from '../../AppContext';
import ErrorBoundary from '../common/ErrorBoundary';
import DashboardSummary from './DashboardSummary';
import GradeDistributionChart from './GradeDistributionChart';
import CriteriaComparisonChart from './CriteriaComparisonChart';
import TypeComparisonChart from './TypeComparisonChart';
import { ANALYSIS_TYPES } from '../../constants/chartConstants';

import { calculateAggregatedMetrics, generateGradeBoxPlotData } from '../../utils/dataTransformers/dashboardUtils';

const DashboardSection = () => {
    const { rawWorks, translatedWorks } = useAppContext();
    const t = useTranslation();

    // Berechnete Metriken für das Dashboard
    const dashboardMetrics = useMemo(() => {
        return calculateAggregatedMetrics(rawWorks);
    }, [rawWorks]);

    // BoxPlot-Daten für Notendistribution
    const boxPlotData = useMemo(() => {
        return generateGradeBoxPlotData(rawWorks);
    }, [rawWorks]);

    return (
        <ErrorBoundary
            fallbackTitle={t('dataErrorTitle', 'errors')}
            fallbackMessage={t('dataErrorMessage', 'errors')}
            showDetails={false}
        >
            <div className="component-container">
                <h3 className="section-title">{t('dashboardTitle', 'chartTitles') || "Analytics Dashboard"}</h3>

                <DashboardSummary metrics={dashboardMetrics.summary} />

                <div className="component-grid grid-2-cols">
                    <div className="component-container">
                        <h4 className="subtitle">{t('gradeDistribution', 'dashboard') || "Grade Distribution"}</h4>
                        <GradeDistributionChart data={boxPlotData} analysisType={ANALYSIS_TYPES.DASHBOARD} />
                    </div>

                    <div className="component-container">
                        <h4 className="subtitle">{t('byWorkType', 'dashboard') || "By Work Type"}</h4>
                        <TypeComparisonChart data={dashboardMetrics.byType} analysisType={ANALYSIS_TYPES.DASHBOARD} />
                    </div>
                </div>

                <div className="component-container">
                    <h4 className="subtitle">{t('criteriaDifferences', 'dashboard') || "Criteria Differences"}</h4>
                    <CriteriaComparisonChart
                        data={dashboardMetrics.criteriaAverages}
                        works={translatedWorks}
                        analysisType={ANALYSIS_TYPES.DASHBOARD}
                    />
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default DashboardSection;