import React from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import SimilarityTableComponent from '../SimilarityTableComponent';
import InterpretationBox from '../InterpretationBox';
import SimilarityAgreementDistributionComponent from "../SimilarityAgreementDistributionComponent";

const SimilarityTab = ({ works }) => {
    const t = useTranslation();

    return (
        <div className="similarity-tab">
            <InterpretationBox title={t('similarityAnalysis', 'dashboard')}>
                {t('similarityDescription', 'dashboard')}
            </InterpretationBox>

            <div className="dashboard-container">
                <h4 className="subtitle">{t('similarityTable', 'dashboard')}</h4>
                <SimilarityTableComponent works={works} />
            </div>

            <div className="dashboard-container">
                <SimilarityAgreementDistributionComponent
                    works={works}
                    translatedWorks={works}
                />
            </div>


        </div>
    );
};

export default SimilarityTab;