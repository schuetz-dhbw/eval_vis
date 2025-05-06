import React, { useMemo } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useAppContext } from '../../AppContext';
import ErrorBoundary from '../common/ErrorBoundary';
import GradeDistributionComponent from './GradeDistributionComponent';
import CriteriaComparisonComponent from './CriteriaComparisonComponent';
import KPICardComponent from './KPICardComponent';
import TypeComparisonComponent from './TypeComparisonComponent';
import { ANALYSIS_TYPES } from '../../constants/chartConstants';
import { calculateAggregatedMetrics, generateGradeBoxPlotData } from '../../utils/dataTransformers/dashboardUtils';
import { formatNumber } from '../../utils/dataUtils';
import {METRICS} from "../../constants/metrics";

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

    // Formatierungs-Hilfsfunktion
    const formatValue = (value) => {
        return formatNumber(value, METRICS.DEFAULT_DECIMAL_PLACES);
    };

    const renderKPICards = (metrics) => {
        return (
            <div className="dashboard-summary">
                <div className="component-grid grid-4-cols">
                <KPICardComponent
                    title={t('totalWorks', 'dashboard')}
                    value={metrics.workCount}
                />
                <KPICardComponent
                    title={t('avgGrades', 'dashboard')}
                    value={`${formatValue(metrics.avgAiGrade)} / ${formatValue(metrics.avgHumanGrade)}`}
                    description={`${t('minMaxDiff', 'dashboard')}: ${formatValue(metrics.minGradeDifference)} / ${formatValue(metrics.maxGradeDifference)}`}
                />
                <KPICardComponent
                    title={t('analyticalWorks', 'dashboard')}
                    value={metrics.analyticalWorks}
                    description={`${metrics.analyticalWorksPercentage}%`}
                />
                <KPICardComponent
                    title={t('constructiveWorks', 'dashboard')}
                    value={metrics.constructiveWorks}
                    description={`${metrics.constructiveWorksPercentage}%`}
                />
            </div>
            </div>
        );
    };

    return (
        <ErrorBoundary
            fallbackTitle={t('dataErrorTitle', 'errors')}
            fallbackMessage={t('dataErrorMessage', 'errors')}
            showDetails={false}
        >
            <div className="component-container">
                <h3 className="section-title">{t('dashboardTitle', 'chartTitles') || "Analytics Dashboard"}</h3>

                {renderKPICards(dashboardMetrics.summary)}

                <div className="component-grid grid-2-cols">
                    <div className="component-container">
                        <h4 className="subtitle">{t('gradeDistribution', 'dashboard') || "Grade Distribution"}</h4>
                        <GradeDistributionComponent data={boxPlotData} analysisType={ANALYSIS_TYPES.DASHBOARD} />
                    </div>

                    <div className="component-container">
                        <h4 className="subtitle">{t('byWorkType', 'dashboard') || "By Work Type"}</h4>
                        <TypeComparisonComponent data={dashboardMetrics.byType} analysisType={ANALYSIS_TYPES.DASHBOARD} />
                    </div>
                </div>

                <div className="component-container">
                    <h4 className="subtitle">{t('criteriaDifferences', 'dashboard') || "Criteria Differences"}</h4>
                    <CriteriaComparisonComponent
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