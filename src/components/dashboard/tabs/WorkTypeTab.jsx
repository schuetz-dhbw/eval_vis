import React from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import TypeComparisonComponent from '../TypeComparisonComponent';
import WorkTypeAnalysisComponent from '../../charts/WorkTypeAnalysisComponent';
import InterpretationBox from '../InterpretationBox';
import { ANALYSIS_TYPES } from '../../../constants/chartConstants';

const WorkTypeTab = ({ byType, rawWorks }) => {
    const t = useTranslation();

    // Arbeitstyp mit größter Differenz identifizieren
    const typesWithMaxDiff = [...byType].sort((a, b) => b.diff - a.diff);
    const maxDiffType = typesWithMaxDiff[0];

    return (
        <div className="work-type-tab">
            <InterpretationBox title={t('byWorkType', 'dashboard')}>
                {maxDiffType ? (
                    <>
                        <strong>{t(maxDiffType.type, 'works.types')}</strong>
                        {t('typeMaxDiffDescription_part1', 'dashboard')}
                        <strong>{maxDiffType.diff.toFixed(1)}%</strong>
                        {t('typeMaxDiffDescription_part2', 'dashboard')}
                    </>
                ) : t('noTypeData', 'dashboard')}
            </InterpretationBox>

            <div className="dashboard-container">
                <h4 className="subtitle">{t('avgGrade', 'dashboard')} - {t('byWorkType', 'dashboard')}</h4>
                <TypeComparisonComponent
                    data={byType}
                    analysisType={ANALYSIS_TYPES.DASHBOARD}
                />
            </div>

            <InterpretationBox>
                {t('workTypeAnalysisDescription', 'dashboard') ||
                    "Die folgende Analyse zeigt Details zu den Unterschieden zwischen analytischen und konstruktiven Arbeiten."}
            </InterpretationBox>

            <div className="dashboard-container">
                <WorkTypeAnalysisComponent
                    works={rawWorks}
                    analysisType={ANALYSIS_TYPES.DASHBOARD}
                />
            </div>
        </div>
    );
};

export default WorkTypeTab;