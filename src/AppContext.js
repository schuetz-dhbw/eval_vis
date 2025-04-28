import React, {createContext, useState, useContext, useMemo, useEffect} from 'react';
import { CHART_TYPES } from './constants/chartTypes';
import { DEFAULT_LANGUAGE } from './constants/languages';
import { works } from './data/works';
import { translations } from './locales';
import { getTranslatedWorks } from './utils/dataTransformers';
import { toggleDarkMode as toggleDarkModeUtil } from './utils/darkmode';
import { setCurrentLanguage } from './services/languageService';

// Context erstellen
const AppContext = createContext();

// Provider-Komponente
export const AppProvider = ({ children }) => {
    const [selectedWorkIndex, setSelectedWorkIndex] = useState(0);
    const [chartType, setChartType] = useState(CHART_TYPES.SCORES);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Initialisierung mit dem Wert aus initDarkMode
        return document.documentElement.getAttribute('data-theme') === 'dark';
    });
    const [language, setLanguage] = useState(DEFAULT_LANGUAGE);

    useEffect(() => {
        setCurrentLanguage(language);
    }, [language]);

    const translatedWorks = useMemo(() => {
        return getTranslatedWorks(works, translations, language);
    }, [language]);

    const currentWork = translatedWorks[selectedWorkIndex];

    const toggleDarkMode = () => {
        const newDarkMode = toggleDarkModeUtil(); // Nutzt die Hilfsfunktion
        setIsDarkMode(newDarkMode);
    };

    const contextValue = {
        selectedWorkIndex, setSelectedWorkIndex,
        chartType, setChartType,
        language,
        setLanguage: (newLang) => {
            setLanguage(newLang);
        },
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