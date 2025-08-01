import React from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import CriteriaComparisonComponent from '../CriteriaComparisonComponent';
import CriteriaSectionComparisonComponent from '../CriteriaSectionComparisonComponent';
import InterpretationBox from '../InterpretationBox';
import { ANALYSIS_TYPES } from '../../../constants/chartConstants';
import WeightingAdaptationComponent from "../WeightingAdaptionComponent";

const CriteriaAnalysisTab = ({ criteriaAverages, rawWorks }) => {
    const t = useTranslation();

    // Kriterium mit größter Differenz identifizieren
    const maxDiffCriterion = criteriaAverages[0];

    return (
        <div className="criteria-analysis-tab">
            <InterpretationBox title={t('sectionComparison', 'dashboard')}>
                {t('sectionComparisonDescription', 'dashboard')}
            </InterpretationBox>

            <div className="dashboard-container">
                <h4 className="subtitle">{t('criteriaBySection', 'dashboard')}</h4>
                <CriteriaSectionComparisonComponent works={rawWorks} />
            </div>
            <InterpretationBox title={t('criteriaDifferences', 'dashboard')}>
                {maxDiffCriterion ? (
                    <>
                        {t('maxDiffDescription_part1', 'dashboard')}
                        <strong>{t(maxDiffCriterion.key, 'works.criteriaLabels')}</strong>
                        {t('maxDiffDescription_part2', 'dashboard')}
                        <strong>{maxDiffCriterion.diff.toFixed(1)}%</strong>.
                    </>
                ) : t('noCriteriaData', 'dashboard')}
            </InterpretationBox>

            <div className="dashboard-container">
                <h4 className="subtitle">{t('criteriaDifferences', 'dashboard')}</h4>
                <CriteriaComparisonComponent
                    rawWorks={rawWorks}
                    analysisType={ANALYSIS_TYPES.DASHBOARD}
                />
            </div>

            <div className="dashboard-container">
                <WeightingAdaptationComponent works={rawWorks} />
            </div>
        </div>
    );
};

export default CriteriaAnalysisTab;