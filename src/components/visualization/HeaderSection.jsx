// components/visualization/HeaderSection.jsx
import React from 'react';
import './styles/header.css';
import { getTranslation } from '../../utils/translationHelpers';

const HeaderSection = ({ work, translations, language }) => {
    const t = (key, section = null) => getTranslation(translations, language, key, section);

    return (
        <div className="header-section">
            <h2 className="main-title">{t('title')}</h2>
        </div>
    );
};

export default HeaderSection;