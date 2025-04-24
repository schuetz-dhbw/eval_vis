import { DEFAULT_LANGUAGE } from '../constants/languages';

// Standardwert aus constants verwenden
let currentLanguage = DEFAULT_LANGUAGE;

export const setCurrentLanguage = (language) => {
    currentLanguage = language;
};

export const getCurrentLanguage = () => {
    return currentLanguage;
};