export const getTranslation = (translations, language, key, section = null) => {
    if (section) {
        // Unterstütze geschachtelte Pfade mit Punktnotation
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