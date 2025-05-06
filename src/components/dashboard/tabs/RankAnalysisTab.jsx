import React from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import SpearmanCorrelationComponent from '../SpearmanCorrelationComponent';
import RankDifferenceAnalysisComponent from '../RankDifferenceAnalysisComponent';
import InterpretationBox from '../InterpretationBox';

const RankAnalysisTab = ({ rankData }) => {
    const t = useTranslation();

    return (
        <div className="rank-analysis-tab">
            <InterpretationBox title={t('rankCorrelation', 'dashboard')}>
                {t('spearmanDescription', 'dashboard') ||
                    `Spearman-Korrelation von ${rankData.spearmanCoefficient.toFixed(2)} zeigt eine ${t(rankData.correlationStrength + 'Correlation', 'dashboard')} zwischen AI und Human Rängen.`}
            </InterpretationBox>

            <div className="dashboard-container">
                <SpearmanCorrelationComponent data={rankData} />
            </div>

            <InterpretationBox>
                {t('rankDifferenceDescription', 'dashboard') ||
                    "Die Tabelle zeigt die Arbeiten mit den größten Rang-Unterschieden zwischen AI und Human."}
            </InterpretationBox>

            <div className="dashboard-container">
                <RankDifferenceAnalysisComponent data={rankData} />
            </div>
        </div>
    );
};

export default RankAnalysisTab;