import React from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import SimilarityBarChartComponent from '../SimilarityBarChartComponent';
import SimilarityTableComponent from '../SimilarityTableComponent';
import InterpretationBox from '../InterpretationBox';

const SimilarityTab = ({ works }) => {
    const t = useTranslation();

    return (
        <div className="similarity-tab">
            <InterpretationBox title={t('similarityAnalysis', 'dashboard')}>
                {t('similarityDescription', 'dashboard') ||
                    "Diese Analyse zeigt die Kosinus-Ähnlichkeit zwischen KI- und Human-Bewertungen für jede Arbeit. Höhere Werte (grün) bedeuten ähnlichere Bewertungsmuster zwischen KI und menschlichen Gutachtern."}
            </InterpretationBox>

            <div className="dashboard-container">
                <h4 className="subtitle">{t('similarityTable', 'dashboard')}</h4>
                <SimilarityTableComponent works={works} />
            </div>

            <div className="dashboard-container">
                <h4 className="subtitle">{t('similarityVisualization', 'dashboard')}</h4>
                <SimilarityBarChartComponent works={works} />
            </div>
        </div>
    );
};

export default SimilarityTab;