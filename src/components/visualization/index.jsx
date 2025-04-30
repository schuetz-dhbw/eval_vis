import React from 'react';
import { useAppContext } from '../../AppContext';

import HeaderSection from './HeaderSection';
import ControlSection from './ControlSection';
import MetricsSection from './MetricsSection';
import ChartSection from './ChartSection';
import DetailsSection from './DetailsSection';
import UsageHintsSection from './UsageHintsSection';
import CriteriaAnalysisSection from './CriteriaAnalysisSection';
import WorkTypeAnalysisSection from './WorkTypeAnalysisSection';
import {ANALYSIS_TYPES} from "../../constants/chartConstants";

const Visualization = () => {
    const { analysisType } = useAppContext();

    return (
        <div className="visualization-container">
            <HeaderSection />

            <ControlSection />

            {analysisType !== ANALYSIS_TYPES.WORK_TYPE_ANALYSIS && (
                <MetricsSection />
            )}

            {analysisType === ANALYSIS_TYPES.STATISTICS ? (
                <CriteriaAnalysisSection />
            ) : analysisType === ANALYSIS_TYPES.WORK_TYPE_ANALYSIS ? (
                <WorkTypeAnalysisSection />
            ) : (
                <ChartSection />
            )}

            {analysisType !== ANALYSIS_TYPES.WORK_TYPE_ANALYSIS && (
                <DetailsSection />
            )}

            <UsageHintsSection />
        </div>
    );
};

export default Visualization;