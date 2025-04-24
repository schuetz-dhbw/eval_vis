import React, { createContext, useState, useContext, useMemo } from 'react';
import { CHART_TYPES } from './constants/chartTypes';
import { DEFAULT_LANGUAGE } from './constants/languages';
import { works } from './data/works';
import { translations } from './locales';
import { getTranslatedWorks } from './utils/dataTransformers';

// Context erstellen
const AppContext = createContext();

// Provider-Komponente
export const AppProvider = ({ children }) => {
    const [selectedWorkIndex, setSelectedWorkIndex] = useState(0);
    const [chartType, setChartType] = useState(CHART_TYPES.SCORES);
    const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
    const [isDarkMode, setIsDarkMode] = useState(
        document.documentElement.classList.contains('dark-mode')
    );

    const translatedWorks = useMemo(() => {
        return getTranslatedWorks(works, translations, language);
    }, [language]);

    const currentWork = translatedWorks[selectedWorkIndex];

    const toggleDarkMode = () => {
        const newDarkMode = !isDarkMode;
        setIsDarkMode(newDarkMode);
        document.documentElement.setAttribute('data-theme', newDarkMode ? 'dark' : 'light');
        localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    };

    const contextValue = {
        selectedWorkIndex, setSelectedWorkIndex,
        chartType, setChartType,
        language, setLanguage,
        translatedWorks, currentWork,
        works: translatedWorks,
        rawWorks: works,
        translations,
        isDarkMode,
        toggleDarkMode
    };

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};

// Custom Hook für einfachen Zugriff auf den Context
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};

export default AppContext;