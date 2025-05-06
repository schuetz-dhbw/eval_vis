import React, { useMemo } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useAppContext } from '../../AppContext';
import ErrorBoundary from '../common/ErrorBoundary';
import GradeDistributionComponent from './GradeDistributionComponent';
import CriteriaComparisonComponent from './CriteriaComparisonComponent';
import KPICardComponent from './KPICardComponent';
import TypeComparisonComponent from './TypeComparisonComponent';
import { ANALYSIS_TYPES } from '../../constants/chartConstants';
import SpearmanCorrelationComponent from './SpearmanCorrelationComponent';
import RankDifferenceAnalysisComponent from './RankDifferenceAnalysisComponent';
import DashboardContainer from './DashboardContainer';
import {
    calculateAggregatedMetrics, calculateRankAnalysis,
    generateGradeBoxPlotData,
    generateParallelCoordinateData, generateViolinPlotData
} from '../../utils/dataTransformers/dashboardUtils';
import { formatNumber } from '../../utils/dataUtils';
import {METRICS} from "../../constants/metrics";
import ViolinPlotComponent from './ViolinPlotComponent';
import ParallelCoordinatePlotComponent from './ParallelCoordinatePlotComponent';

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

    // Datenaufbereitung für ViolinPlot
    const violinData = useMemo(() => {
        return generateViolinPlotData(rawWorks);
    }, [rawWorks]);

    // Datenaufbereitung für ParallelCoordinatePlot
    const parallelData = useMemo(() => {
        return generateParallelCoordinateData(rawWorks);
    }, [rawWorks]);

    // Rangdaten berechnen
    const rankAnalysisData = useMemo(() => {
        return calculateRankAnalysis(rawWorks, translatedWorks);
    }, [rawWorks, translatedWorks]);

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
            <DashboardContainer title={t('dashboardTitle', 'chartTitles') || "Analytics Dashboard"}>
                {renderKPICards(dashboardMetrics.summary)}

                <div className="component-grid grid-2-cols">
                    <DashboardContainer title={t('gradeDistribution', 'dashboard') + ' - ' + t('gradeBoxplot', 'dashboard')}>
                        <GradeDistributionComponent data={boxPlotData} analysisType={ANALYSIS_TYPES.DASHBOARD} />
                    </DashboardContainer>

                    <DashboardContainer title={t('avgGrade', 'dashboard') + ' - ' + t('byWorkType', 'dashboard')}>
                        <TypeComparisonComponent data={dashboardMetrics.byType} analysisType={ANALYSIS_TYPES.DASHBOARD} />
                    </DashboardContainer>
                </div>

                <DashboardContainer title={t('gradeDistribution', 'dashboard') + ' - ' + t('gradeViolinplot', 'dashboard')}>
                    <ViolinPlotComponent data={violinData} />
                </DashboardContainer>

                <DashboardContainer title={t('gradeComparison', 'dashboard')}>
                    <ParallelCoordinatePlotComponent data={parallelData} />
                </DashboardContainer>

                <div className="component-grid">
                    <SpearmanCorrelationComponent data={rankAnalysisData} />
                </div>

                <div className="component-grid">
                    <RankDifferenceAnalysisComponent data={rankAnalysisData} />
                </div>

                <DashboardContainer title={t('criteriaDifferences', 'dashboard') || "Criteria Differences"}>
                    <CriteriaComparisonComponent
                        data={dashboardMetrics.criteriaAverages}
                        works={translatedWorks}
                        analysisType={ANALYSIS_TYPES.DASHBOARD}
                    />
                </DashboardContainer>
            </DashboardContainer>
        </ErrorBoundary>
    );
};

export default DashboardSection;