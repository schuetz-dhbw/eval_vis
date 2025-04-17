import React from 'react';
import './styles/workTypeAnalysis.css';
import { useTranslation } from '../../hooks/useTranslation';
import WorkTypeAnalysisComponent from '../charts/WorkTypeAnalysisComponent';

const WorkTypeAnalysisSection = ({ works, language }) => {
    const t = useTranslation(language);

    return (
        <div className="work-type-analysis-section">
            <h3 className="section-title">{t('workTypeAnalysisTitle', 'chartTitles') || "Work Type Analysis"}</h3>
            <div className="analysis-content">
                <WorkTypeAnalysisComponent
                    works={works}
                    language={language}
                />
            </div>
        </div>
    );
};

export default WorkTypeAnalysisSection;