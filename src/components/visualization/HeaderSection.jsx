import React from 'react';
import './styles/header.css';
import { getTranslation } from '../../utils/translationHelpers';

const HeaderSection = ({ work, translations, language }) => {
    const t = (key, section = null) => getTranslation(translations, language, key, section);

    return (
        <div className="header-section">
            <h2 className="main-title">{t('title')}</h2>
            <div className="metrics">
                <p>
                    <span className="metric-label">{t('cosine', 'metrics')}:</span> {work.similarity.toFixed(4)}
                </p>
                <p>
                    <span className="metric-label">{t('distance', 'metrics')}:</span> {work.distance.toFixed(3)}
                </p>
            </div>
        </div>
    );
};

export default HeaderSection;
