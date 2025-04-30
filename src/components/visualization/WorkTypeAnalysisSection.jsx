import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import WorkTypeAnalysisComponent from '../charts/WorkTypeAnalysisComponent';
import ChartErrorBoundary from '../charts/ChartErrorBoundary';
import DataErrorBoundary from '../common/DataErrorBoundary';
import ErrorBoundary from '../common/ErrorBoundary';
import {useAppContext} from "../../AppContext";

import {ANALYSIS_TYPES} from "../../constants/chartConstants";

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
                <h3 className="section-title">{t('workTypeAnalysisTitle', 'chartTitles')}</h3>
                <div className="flex-column">
                    <DataErrorBoundary data={rawWorks} >
                        <ChartErrorBoundary >
                            <WorkTypeAnalysisComponent
                                works={rawWorks}
                                analysisType={ANALYSIS_TYPES.WORK_TYPE_ANALYSIS}
                            />
                        </ChartErrorBoundary>
                    </DataErrorBoundary>
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default WorkTypeAnalysisSection;