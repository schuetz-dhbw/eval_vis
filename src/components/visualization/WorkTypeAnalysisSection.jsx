import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import WorkTypeAnalysisComponent from '../charts/WorkTypeAnalysisComponent';
import ChartErrorBoundary from '../charts/ChartErrorBoundary';
import DataErrorBoundary from '../common/DataErrorBoundary';
import ErrorBoundary from '../common/ErrorBoundary';
import {useAppContext} from "../../AppContext";

const WorkTypeAnalysisSection = () => {
    const { rawWorks } = useAppContext();
    const t = useTranslation();

    return (
        <ErrorBoundary
            fallbackTitle={t('dataErrorTitle', 'errors')}
            fallbackMessage={t('dataErrorMessage', 'errors')}
            showDetails={false}
        >
            <div className="component-container ">
                <h3 className="section-title">{t('workTypeAnalysisTitle', 'chartTitles') || "Work Type Analysis"}</h3>
                <div className="flex-column">
                    <DataErrorBoundary data={rawWorks} >
                        <ChartErrorBoundary >
                            <WorkTypeAnalysisComponent
                                works={rawWorks}
                            />
                        </ChartErrorBoundary>
                    </DataErrorBoundary>
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default WorkTypeAnalysisSection;