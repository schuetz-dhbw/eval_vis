import React from 'react';
import './styles/darkModeToggle.css';
import {useAppContext} from "../../AppContext";
import {useTranslation} from "../../hooks/useTranslation";

const DarkModeToggle = () => {
    const { language, isDarkMode, toggleDarkMode } = useAppContext();
    const t = useTranslation(language);

    // Tooltips aus den Übersetzungen
    const tooltipText = isDarkMode
        ? t('toggleToLight', 'darkMode')
        : t('toggleToDark', 'darkMode');

    return (
        <button
            className="dark-mode-toggle"
            onClick={toggleDarkMode}
            aria-label={tooltipText}
            title={tooltipText}
        >
            {isDarkMode ? '☀️' : '🌙'}
        </button>
    );
};

export default DarkModeToggle;