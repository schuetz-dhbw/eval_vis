import React from 'react';
import './styles/usageHints.css';
import { getTranslation } from '../../utils/translationHelpers';
import { CHART_TYPES } from '../../data/chartTypes';

const UsageHintsSection = ({ translations, language, chartType }) => {
    const t = (key, section = null) => getTranslation(translations, language, key, section);

    return (
        <div className="usage-hints">
            <h3 className="hints-title">{t('title', 'hints')}</h3>
            <ul className="hints-list">
                <li><span className="term">{t('scores', 'hints')}</span> {t('scoresDesc', 'hints')}</li>
                <li><span className="term">{t('weights', 'hints')}</span> {t('weightsDesc', 'hints')}</li>
                <li><span className="term">{t('weighted', 'hints')}</span> {t('weightedDesc', 'hints')}</li>
                <li><span className="term">{t('combined', 'hints')}</span> {t('combinedDesc', 'hints')}</li>
                <li><span className="term">{t('statistics', 'hints')}</span> {t('statisticsDesc', 'hints')}</li>
                <li>{t('tooltip', 'hints')}</li>
                {chartType !== CHART_TYPES.STATISTICS && <li>{t('table', 'hints')}</li>}
            </ul>
        </div>
    );
};

export default UsageHintsSection;