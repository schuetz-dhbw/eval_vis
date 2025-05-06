import React from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import GradeDistributionComponent from '../GradeDistributionComponent';
import InterpretationBox from '../InterpretationBox';
import { ANALYSIS_TYPES } from '../../../constants/chartConstants';

const OverviewTab = ({ boxPlotData }) => {
    const t = useTranslation();

    return (
        <div className="overview-tab">
            <InterpretationBox title={t('overview', 'dashboard')}>
                {t('overviewDescription', 'dashboard') ||
                    "Dieses Dashboard gibt einen Überblick über die Bewertungsunterschiede zwischen KI und menschlichen Gutachtern. Die obigen Kennzahlen zeigen die wichtigsten aggregierten Metriken. Der Boxplot unten zeigt die Verteilung der Noten im Vergleich."}
            </InterpretationBox>

            <div className="dashboard-container">
                <h4 className="subtitle">{t('gradeDistribution', 'dashboard')} - {t('gradeBoxplot', 'dashboard')}</h4>
                <GradeDistributionComponent
                    data={boxPlotData}
                    analysisType={ANALYSIS_TYPES.DASHBOARD}
                />
            </div>
        </div>
    );
};

export default OverviewTab;