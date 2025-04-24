// languageService.js - Zentraler Service für Spracheinstellungen
let currentLanguage = 'de'; // Default-Wert

export const setCurrentLanguage = (language) => {
    currentLanguage = language;
};

export const getCurrentLanguage = () => {
    return currentLanguage;
};