import { de } from './de';
import { en } from './en';
import worksDE from './works-de.json';
import worksEN from './works-en.json';

const baseTranslations = {
    de,
    en
};

export const translations = {
    de: {
        ...baseTranslations.de,
        works: worksDE
    },
    en: {
        ...baseTranslations.en,
        works: worksEN
    }
};