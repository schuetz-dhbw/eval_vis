export const getTranslation = (translations, language, key, section = null) => {
    if (section) {
        // Support nested paths with dot notation
        const path = section.split('.');
        let current = translations[language];

        for (const part of path) {
            if (!current || !current[part]) {
                return key;
            }
            current = current[part];
        }

        return current[key] || key;
    }
    return translations[language][key] || key;
};