/**
 * Funktionen für Übersetzungen von Daten
 */

import { translations } from '../../locales/index';

// Holt übersetzte Kurz-Labels für Kriterien
export const getTranslatedLabels = (work, language) => {
    return work.criteriaKeys.map(key => {
        const worksTranslations = translations[language]?.works || {};
        return worksTranslations.criteriaShortLabels?.[key] || key;
    });
};

// Translations für die Arbeiten
export const getTranslatedWorks = (works, translations, language) => {
    const worksTranslations = translations[language]?.works || {};

    return works.map(work => {
        // Texte aus den Übersetzungsdateien abrufen
        const title = worksTranslations.titles?.[work.key] || work.key;
        const type = worksTranslations.types?.[work.typeKey] || work.typeKey;
        const typeDesc = worksTranslations.typeDescriptions?.[work.typeDescKey] || work.typeDescKey;

        // Kriterien übersetzen
        const criteriaLabels = work.criteriaKeys.map(key =>
            worksTranslations.criteriaLabels?.[key] || key
        );

        // Kurze Kriterien-Labels
        const criteriaShortLabels = work.criteriaKeys.map(key =>
            worksTranslations.criteriaShortLabels?.[key] || key
        );

        return {
            ...work,
            title,
            type,
            typeDesc,
            criteriaLabels,
            criteriaShortLabels
        };
    });
};