import React from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import ViolinPlotComponent from '../ViolinPlotComponent';
import ParallelCoordinatePlotComponent from '../ParallelCoordinatePlotComponent';
import InterpretationBox from '../InterpretationBox';

const GradeDistributionTab = ({ violinData, parallelData }) => {
    const t = useTranslation();

    return (
        <div className="grade-distribution-tab">
            <InterpretationBox title={t('gradeDistribution', 'dashboard')}>
                {t('violinDescription', 'dashboard') ||
                    "Die Violin-Plots zeigen die Verteilung der Noten für AI und Human. Die Breite an jeder Stelle zeigt an, wie viele Arbeiten diese Note erhalten haben."}
            </InterpretationBox>

            <div className="dashboard-container">
                <h4 className="subtitle">{t('gradeDistribution', 'dashboard')} - {t('gradeViolinplot', 'dashboard')}</h4>
                <ViolinPlotComponent data={violinData} />
            </div>

            <InterpretationBox>
                {t('parallelDescription', 'dashboard') ||
                    "Der Parallel-Koordinaten-Plot verbindet jede Arbeit durch eine Linie zwischen AI-Note (links) und Human-Note (rechts). Die Farbe der Linie zeigt den Grad der Abweichung."}
            </InterpretationBox>

            <div className="dashboard-container">
                <h4 className="subtitle">{t('gradeComparison', 'dashboard')}</h4>
                <ParallelCoordinatePlotComponent data={parallelData} />
            </div>
        </div>
    );
};

export default GradeDistributionTab;