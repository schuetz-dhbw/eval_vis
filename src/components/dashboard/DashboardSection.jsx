import React, {useMemo, useState} from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useAppContext } from '../../AppContext';
import ErrorBoundary from '../common/ErrorBoundary';
import KPICardComponent from './KPICardComponent';
import DashboardContainer from './DashboardContainer';
import {
    calculateAggregatedMetrics, calculateRankAnalysis,
    generateGradeBoxPlotData,
    generateParallelCoordinateData, generateViolinPlotData
} from '../../utils/dataTransformers/dashboardUtils';
import { formatNumber } from '../../utils/dataUtils';
import {METRICS} from "../../constants/metrics";
import TabContent from "../common/TabContent";
import CriteriaAnalysisTab from "./tabs/CriteriaAnalysisTab";
import WorkTypeTab from "./tabs/WorkTypeTab";
import RankAnalysisTab from "./tabs/RankAnalysisTab";
import GradeDistributionTab from "./tabs/GradeDistributionTab";
import OverviewTab from "./tabs/OverviewTab";
import TabNavigation from "../common/TabNavigation";

// Konstanten für die Tab-Keys
const DASHBOARD_TABS = {
    OVERVIEW: 'overview',
    GRADE_DISTRIBUTION: 'gradeDistribution',
    RANK_ANALYSIS: 'rankAnalysis',
    CRITERIA_ANALYSIS: 'criteriaAnalysis',
    WORK_TYPE: 'workType'
};

const DashboardSection = () => {
    const { rawWorks, translatedWorks } = useAppContext();
    const t = useTranslation();

    // State für aktiven Tab
    const [activeTab, setActiveTab] = useState(DASHBOARD_TABS.OVERVIEW);

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

    // Tab-Definitionen
    const tabs = [
        { key: DASHBOARD_TABS.OVERVIEW, label: t('overview', 'dashboard') || "Überblick" },
        { key: DASHBOARD_TABS.GRADE_DISTRIBUTION, label: t('gradeDistribution', 'dashboard') || "Notenverteilung" },
        { key: DASHBOARD_TABS.RANK_ANALYSIS, label: t('rankAnalysis', 'dashboard') || "Rang-Analyse" },
        { key: DASHBOARD_TABS.CRITERIA_ANALYSIS, label: t('criteriaAnalysis', 'dashboard') || "Kriterien-Analyse" },
        { key: DASHBOARD_TABS.WORK_TYPE, label: t('workType', 'dashboard') || "Arbeitstypen" }
    ];

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

                <TabNavigation
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    tabs={tabs}
                />

                <TabContent activeTab={activeTab} tabKey={DASHBOARD_TABS.OVERVIEW}>
                    <OverviewTab
                        metrics={dashboardMetrics.summary}
                        boxPlotData={boxPlotData}
                    />
                </TabContent>

                <TabContent activeTab={activeTab} tabKey={DASHBOARD_TABS.GRADE_DISTRIBUTION}>
                    <GradeDistributionTab
                        violinData={violinData}
                        parallelData={parallelData}
                    />
                </TabContent>

                <TabContent activeTab={activeTab} tabKey={DASHBOARD_TABS.RANK_ANALYSIS}>
                    <RankAnalysisTab
                        rankData={rankAnalysisData}
                    />
                </TabContent>

                <TabContent activeTab={activeTab} tabKey={DASHBOARD_TABS.CRITERIA_ANALYSIS}>
                    <CriteriaAnalysisTab
                        criteriaAverages={dashboardMetrics.criteriaAverages}
                        translatedWorks={translatedWorks}
                    />
                </TabContent>

                <TabContent activeTab={activeTab} tabKey={DASHBOARD_TABS.WORK_TYPE}>
                    <WorkTypeTab
                        byType={dashboardMetrics.byType}
                        rawWorks={rawWorks}
                    />
                </TabContent>
            </DashboardContainer>
        </ErrorBoundary>
    );
};

export default DashboardSection;