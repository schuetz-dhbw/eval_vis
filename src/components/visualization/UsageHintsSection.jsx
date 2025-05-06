import React, { memo } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useAppContext } from '../../AppContext';
import { ANALYSIS_TYPES } from "../../constants/chartConstants";

const UsageHintsSection = memo(() => {
    const { analysisType } = useAppContext();
    const t = useTranslation();

    return (
        <div className="usage-hints">
            <h3 className="hints-title">{t('title', 'hints')}</h3>
            <ul className="hints-list">
                {analysisType === ANALYSIS_TYPES.DASHBOARD ? (
                    // Spezifische Hinweise für das Dashboard
                    <>
                        <li><span className="term">{t('dashboard', 'hints')}</span> {t('dashboardDesc', 'hints')}</li>
                        <li><span className="term">{t('tabNavigation', 'hints')}</span> {t('tabNavigationDesc', 'hints')}</li>
                        <li><span className="term">{t('interpretation', 'hints')}</span> {t('interpretationDesc', 'hints')}</li>
                    </>
                ) : (
                    // Hinweise für die herkömmlichen Analysetypen
                    <>
                        <li><span className="term">{t('analysisTypes', 'hints')}</span> {t('analysisTypesDesc', 'hints')}</li>
                        <li><span className="term">{t('scores', 'hints')}</span> {t('scoresDesc', 'hints')}</li>
                        <li><span className="term">{t('weights', 'hints')}</span> {t('weightsDesc', 'hints')}</li>
                        <li><span className="term">{t('combined', 'hints')}</span> {t('combinedDesc', 'hints')}</li>
                        <li><span className="term">{t('statistics', 'hints')}</span> {t('statisticsDesc', 'hints')}</li>
                    </>
                )}
                <li><span className="term">{t('darkMode', 'hints')}</span> {t('darkModeDesc', 'hints')}</li>
                <li><span className="term">{t('language', 'hints')}</span> {t('languageDesc', 'hints')}</li>
                {analysisType !== ANALYSIS_TYPES.DASHBOARD && analysisType !== ANALYSIS_TYPES.STATISTICS && (
                    <li>{t('table', 'hints')}</li>
                )}
                <li>{t('feedback', 'hints')}</li>
            </ul>
        </div>
    );
});

export default UsageHintsSection;