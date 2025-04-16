import React from 'react';
import './styles/workTypeAnalysis.css';
import { getTranslation } from '../../utils/translationHelpers';
import WorkTypeAnalysisComponent from '../charts/WorkTypeAnalysisComponent';

const WorkTypeAnalysisSection = ({ works, translations, language }) => {
    const t = (key, section = null) => getTranslation(translations, language, key, section);

    return (
        <div className="work-type-analysis-section">
            <h3 className="section-title">{t('workTypeAnalysisTitle', 'chartTitles') || "Work Type Analysis"}</h3>
            <div className="analysis-content">
                <WorkTypeAnalysisComponent
                    works={works}
                    translations={translations}
                    language={language}
                />
            </div>
        </div>
    );
};

export default WorkTypeAnalysisSection;