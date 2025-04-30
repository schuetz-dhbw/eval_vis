import React, { memo } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useAppContext } from '../../AppContext';
import {ANALYSIS_TYPES} from "../../constants/chartConstants";

const UsageHintsSection = memo(() => {
    const { analysisType } = useAppContext();
    const t = useTranslation();

    return (
        <div className="usage-hints">
            <h3 className="hints-title">{t('title', 'hints')}</h3>
            <ul className="hints-list">
                <li><span className="term">{t('scores', 'hints')}</span> {t('scoresDesc', 'hints')}</li>
                <li><span className="term">{t('weights', 'hints')}</span> {t('weightsDesc', 'hints')}</li>
                <li><span className="term">{t('combined', 'hints')}</span> {t('combinedDesc', 'hints')}</li>
                <li><span className="term">{t('statistics', 'hints')}</span> {t('statisticsDesc', 'hints')}</li>
                <li><span className="term">{t('workTypeAnalysis', 'hints')}</span> {t('workTypeAnalysisDesc', 'hints')}</li>
                <li>{t('tooltip', 'hints')}</li>
                {![ANALYSIS_TYPES.STATISTICS, ANALYSIS_TYPES.WORK_TYPE_ANALYSIS].includes(analysisType) && (<li>{t('table', 'hints')}</li>)}
            </ul>
        </div>
    );
});

export default UsageHintsSection;