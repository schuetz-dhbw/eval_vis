import { useMemo } from 'react';
import { getTranslation } from '../utils/translationHelpers';
import { translations } from '../locales';

/**
 * Hook für einfachen Zugriff auf Übersetzungen
 * @param {string} language - Aktuell ausgewählte Sprache
 * @returns {Function} - Übersetzungsfunktion (key, section) => übersetzter Text
 */
export function useTranslation(language) {
    const t = useMemo(() => {
        return (key, section = null) => getTranslation(translations, language, key, section);
    }, [language]);

    return t;
}