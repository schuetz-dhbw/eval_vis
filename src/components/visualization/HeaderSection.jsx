import React from 'react';
import './styles/header.css';
import { useTranslation } from '../../hooks/useTranslation';

const HeaderSection = ({ language }) => {
    const t = useTranslation(language);

    return (
        <div className="header-section">
            <h2 className="main-title">{t('title')}</h2>
        </div>
    );
};

export default HeaderSection;