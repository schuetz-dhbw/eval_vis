import { getTranslation } from './translationHelpers';

// Für kürzere Achsenbeschriftungen
export const getShortLabels = (work, translations, language) => {
    const t = (key, section = null) => getTranslation(translations, language, key, section);

    return work.criteriaLabels.map(label => {
        if (label === "Fachliche Bearbeitung") return t('professionalTreatment', 'criteria');
        if (label === "Nutzung von Fachwissen") return t('useOfExpertise', 'criteria');
        if (label === "Einsatz von Methoden") return t('useMethods', 'criteria');
        if (label === "Umsetzbarkeit") return t('feasibility', 'criteria');
        if (label === "Kreativität") return t('creativity', 'criteria');
        if (label === "Wirtschaftliche Bewertung") return t('economic', 'criteria');
        if (label === "Selbständigkeit") return t('independence', 'criteria');
        if (label === "Systematik") return t('systematic', 'criteria');
        if (label === "Dokumentation") return t('documentation', 'criteria');
        if (label === "Literaturrecherche") return t('litResearch', 'criteria');
        if (label === "Verwendung Literatur") return t('litUse', 'criteria');
        return label;
    });
};

// Daten für die Bewertungsdiagramme
export const getScoresData = (work, translations, language) => {
    const t = (key, section = null) => getTranslation(translations, language, key, section);
    const shortLabels = getShortLabels(work, translations, language);

    return work.criteriaLabels.map((label, index) => {
        return {
            name: label,
            shortName: shortLabels[index],
            [t('ki', 'labels')]: work.ki_scores[index],
            [t('human', 'labels')]: work.human_scores[index],
        };
    });
};

// Daten für die Gewichtungsdiagramme
export const getWeightsData = (work, translations, language) => {
    const t = (key, section = null) => getTranslation(translations, language, key, section);
    const shortLabels = getShortLabels(work, translations, language);

    return work.criteriaLabels.map((label, index) => {
        return {
            name: label,
            shortName: shortLabels[index],
            [t('ki', 'labels')]: work.ki_weights[index] * 100, // Skaliert für bessere Sichtbarkeit
            [t('human', 'labels')]: work.human_weights[index] * 100,
        };
    });
};

// Daten für die gewichteten Bewertungsdiagramme
export const getWeightedData = (work, translations, language) => {
    const t = (key, section = null) => getTranslation(translations, language, key, section);
    const shortLabels = getShortLabels(work, translations, language);

    return work.criteriaLabels.map((label, index) => {
        return {
            name: label,
            shortName: shortLabels[index],
            [t('ki', 'labels')]: work.ki_scores[index] * work.ki_weights[index],
            [t('human', 'labels')]: work.human_scores[index] * work.human_weights[index],
        };
    });
};

// Daten für die kombinierte Darstellung
export const getCombinedData = (work, translations, language) => {
    const t = (key, section = null) => getTranslation(translations, language, key, section);
    const shortLabels = getShortLabels(work, translations, language);

    return work.criteriaLabels.map((label, index) => {
        return {
            name: label,
            shortName: shortLabels[index],
            [`${t('ki', 'labels')}Score`]: work.ki_scores[index],
            [`${t('human', 'labels')}Score`]: work.human_scores[index],
            [`${t('ki', 'labels')}Weight`]: work.ki_weights[index] * 100,
            [`${t('human', 'labels')}Weight`]: work.human_weights[index] * 100,
            [`${t('ki', 'labels')}Weighted`]: work.ki_scores[index] * work.ki_weights[index],
            [`${t('human', 'labels')}Weighted`]: work.human_scores[index] * work.human_weights[index],
        };
    });
};

// Daten für das Radar/Spinnendiagramm
export const getRadarData = (work, translations, language, chartType) => {
    const t = (key, section = null) => getTranslation(translations, language, key, section);
    const shortLabels = getShortLabels(work, translations, language);

    if (chartType === 'weighted') {
        return work.criteriaLabels.map((label, index) => {
            return {
                subject: label,
                shortSubject: shortLabels[index],
                [t('ki', 'labels')]: work.ki_scores[index] * work.ki_weights[index],
                [t('human', 'labels')]: work.human_scores[index] * work.human_weights[index],
                fullMark: 10,
            };
        });
    } else if (chartType === 'weights') {
        return work.criteriaLabels.map((label, index) => {
            return {
                subject: label,
                shortSubject: shortLabels[index],
                [t('ki', 'labels')]: work.ki_weights[index] * 100,
                [t('human', 'labels')]: work.human_weights[index] * 100,
                fullMark: 25,
            };
        });
    } else {
        return work.criteriaLabels.map((label, index) => {
            return {
                subject: label,
                shortSubject: shortLabels[index],
                [t('ki', 'labels')]: work.ki_scores[index],
                [t('human', 'labels')]: work.human_scores[index],
                fullMark: 100,
            };
        });
    }
};

// Y-Achsen-Domain basierend auf dem Charttyp
export const getYDomain = (chartType) => {
    switch(chartType) {
        case 'weights':
            return [0, 25];
        case 'weighted':
            return [0, 20];
        case 'combined':
        case 'scores':
        default:
            return [0, 100];
    }
};

// Radar-Domain basierend auf dem Charttyp
export const getRadarDomain = (chartType) => {
    switch(chartType) {
        case 'weights':
            return [0, 25];
        case 'weighted':
            return [0, 20];
        default:
            return [0, 100];
    }
};