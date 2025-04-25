import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';

const HeaderSection = () => {
    const t = useTranslation();

    return (
        <div className="header-section">
            <h1 className="main-title">{t('title')}</h1>
            <h2 className="sub-title">{t('subtitle')}</h2>
        </div>
    );
};

export default HeaderSection;