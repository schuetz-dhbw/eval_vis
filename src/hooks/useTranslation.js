import { useContext } from 'react';
import { getTranslation } from '../utils/translationHelpers';
import { translations } from '../locales';
import AppContext from '../AppContext';

export function useTranslation() {
    const { language } = useContext(AppContext);

    return (key, section = null) => getTranslation(translations, language, key, section);
}