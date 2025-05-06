import React from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import CriteriaComparisonComponent from '../CriteriaComparisonComponent';
import InterpretationBox from '../InterpretationBox';
import { ANALYSIS_TYPES } from '../../../constants/chartConstants';

const CriteriaAnalysisTab = ({ criteriaAverages, translatedWorks }) => {
    const t = useTranslation();

    // Kriterium mit größter Differenz identifizieren
    const maxDiffCriterion = criteriaAverages[0];

    return (
        <div className="criteria-analysis-tab">
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
                    data={criteriaAverages}
                    works={translatedWorks}
                    analysisType={ANALYSIS_TYPES.DASHBOARD}
                />
            </div>
        </div>
    );
};

export default CriteriaAnalysisTab;