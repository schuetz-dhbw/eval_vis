export const getTranslation = (translations, language, key, section = null) => {
    if (section) {
        return translations[language][section][key] || key;
    }
    return translations[language][key] || key;
};