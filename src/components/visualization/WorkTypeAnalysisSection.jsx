import React from 'react';
import './styles/workTypeAnalysis.css';
import { useTranslation } from '../../hooks/useTranslation';
import WorkTypeAnalysisComponent from '../charts/WorkTypeAnalysisComponent';
import ChartErrorBoundary from '../charts/ChartErrorBoundary';
import DataErrorBoundary from '../common/DataErrorBoundary';
import ErrorBoundary from '../common/ErrorBoundary';
import {useAppContext} from "../../AppContext";

const WorkTypeAnalysisSection = () => {
    const { rawWorks, language } = useAppContext();
    const t = useTranslation(language);

    return (
        <ErrorBoundary
            fallbackTitle={t('dataErrorTitle', 'errors')}
            fallbackMessage={t('dataErrorMessage', 'errors')}
            showDetails={false}
        >
            <div className="work-type-analysis-section">
                <h3 className="section-title">{t('workTypeAnalysisTitle', 'chartTitles') || "Work Type Analysis"}</h3>
                <div className="analysis-content">
                    <DataErrorBoundary data={rawWorks} language={language}>
                        <ChartErrorBoundary language={language} chartType="workTypeAnalysis">
                            <WorkTypeAnalysisComponent
                                works={rawWorks}
                                language={language}
                            />
                        </ChartErrorBoundary>
                    </DataErrorBoundary>
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default WorkTypeAnalysisSection;