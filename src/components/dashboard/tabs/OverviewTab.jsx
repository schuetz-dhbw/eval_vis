import React from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import GradeDistributionComponent from '../GradeDistributionComponent';
import InterpretationBox from '../InterpretationBox';
import { ANALYSIS_TYPES } from '../../../constants/chartConstants';
import GradeAgreementAnalysisComponent from "../GradeAgreementAnalysisComponent";
import GradeBoxplotComponent from "../GradeBoxplotComponent";

const OverviewTab = ({ boxPlotData, rawWorks, translatedWorks  }) => {
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

            <div className="dashboard-container">
                <h4 className="subtitle">{t('gradeDistribution', 'dashboard')} - {t('gradeBoxplot', 'dashboard')}</h4>
                <GradeBoxplotComponent
                    data={boxPlotData}
                    analysisType={ANALYSIS_TYPES.DASHBOARD}
                    works={translatedWorks}
                />
            </div>

            <div className="dashboard-container">
                <GradeAgreementAnalysisComponent
                    works={rawWorks}
                    translatedWorks={translatedWorks}
                />
            </div>
        </div>
    );
};

export default OverviewTab;