import { getTranslation } from './translationHelpers';

// Calculate cosine similarity between two vectors
export const calculateCosineSimilarity = (vectorA, vectorB) => {
    if (vectorA.length !== vectorB.length) {
        console.error('Vectors must be of the same length');
        return 0;
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vectorA.length; i++) {
        dotProduct += vectorA[i] * vectorB[i];
        normA += vectorA[i] * vectorA[i];
        normB += vectorB[i] * vectorB[i];
    }

    if (normA === 0 || normB === 0) {
        return 0;
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

// Calculate Euclidean distance between two vectors
export const calculateEuclideanDistance = (vectorA, vectorB) => {
    if (vectorA.length !== vectorB.length) {
        console.error('Vectors must be of the same length');
        return 0;
    }

    let sum = 0;
    for (let i = 0; i < vectorA.length; i++) {
        sum += Math.pow(vectorA[i] - vectorB[i], 2);
    }

    return Math.sqrt(sum);
};

// Calculate similarity metrics for a work
export const calculateSimilarityMetrics = (work) => {
    const similarity = calculateCosineSimilarity(work.aiScores, work.humanScores);
    const distance = calculateEuclideanDistance(work.aiScores, work.humanScores);

    return {
        similarity,
        distance
    };
};

// Calculate statistics for a work
export const calculateStatistics = (work) => {
    // Calculate average scores
    const kiAverage = work.aiScores.reduce((sum, score) => sum + score, 0) / work.aiScores.length;
    const humanAverage = work.humanScores.reduce((sum, score) => sum + score, 0) / work.humanScores.length;

    // Calculate standard deviations
    const kiStdDev = Math.sqrt(
        work.aiScores.reduce((sum, score) => sum + Math.pow(score - kiAverage, 2), 0) / work.aiScores.length
    );
    const humanStdDev = Math.sqrt(
        work.humanScores.reduce((sum, score) => sum + Math.pow(score - humanAverage, 2), 0) / work.humanScores.length
    );

    // Calculate differences in assessments
    const differences = work.aiScores.map((score, i) => Math.abs(score - work.humanScores[i]));
    const avgDifference = differences.reduce((sum, diff) => sum + diff, 0) / differences.length;
    const maxDifference = Math.max(...differences);
    const minDifference = Math.min(...differences);

    // Calculate weighted averages
    const aiWeightedSum = work.aiScores.reduce((sum, score, i) => sum + score * work.aiWeights[i], 0);
    const humanWeightedSum = work.humanScores.reduce((sum, score, i) => sum + score * work.humanWeights[i], 0);

    // Calculate differences in weights
    const weightDifferences = work.aiWeights.map((weight, i) =>
        Math.abs(weight - work.humanWeights[i])
    );
    const avgWeightDiff = weightDifferences.reduce((sum, diff) => sum + diff, 0) / weightDifferences.length;

    return {
        kiAverage,
        humanAverage,
        kiStdDev,
        humanStdDev,
        avgDifference,
        maxDifference,
        minDifference,
        aiWeightedSum,
        humanWeightedSum,
        avgWeightDiff
    };
};

// Für kürzere Achsenbeschriftungen
export const getShortLabels = (work, translations, language) => {
    // Wenn criteriaShortLabels bereits an work angehängt wurde, verwende diese direkt
    if (work.criteriaShortLabels) {
        return work.criteriaShortLabels;
    }

    // Andernfalls übersetze aus den JSON-Dateien
    const worksTranslations = translations[language]?.works || {};

    return work.criteriaKeys.map(label => {
        const shortLabel =
            worksTranslations.criteriaShortLabels &&
            worksTranslations.criteriaShortLabels[label];
        return shortLabel || label;
    });
};

// Daten für die Bewertungsdiagramme
export const getScoresData = (work, translations, language) => {
    const t = (key, section = null) => getTranslation(translations, language, key, section);
    const shortLabels = getShortLabels(work, translations, language);

    return work.criteriaKeys.map((label, index) => {
        return {
            name: label,
            shortName: shortLabels[index],
            [t('ki', 'labels')]: work.aiScores[index],
            [t('human', 'labels')]: work.humanScores[index],
        };
    });
};

// Daten für die Gewichtungsdiagramme
export const getWeightsData = (work, translations, language) => {
    const t = (key, section = null) => getTranslation(translations, language, key, section);
    const shortLabels = getShortLabels(work, translations, language);

    return work.criteriaKeys.map((label, index) => {
        return {
            name: label,
            shortName: shortLabels[index],
            [t('ki', 'labels')]: work.aiWeights[index] * 100, // Skaliert für bessere Sichtbarkeit
            [t('human', 'labels')]: work.humanWeights[index] * 100,
        };
    });
};

// Daten für die gewichteten Bewertungsdiagramme
export const getWeightedData = (work, translations, language) => {
    const t = (key, section = null) => getTranslation(translations, language, key, section);
    const shortLabels = getShortLabels(work, translations, language);

    return work.criteriaKeys.map((label, index) => {
        return {
            name: label,
            shortName: shortLabels[index],
            [t('ki', 'labels')]: work.aiScores[index] * work.aiWeights[index],
            [t('human', 'labels')]: work.humanScores[index] * work.humanWeights[index],
        };
    });
};

// Daten für die kombinierte Darstellung
export const getCombinedData = (work, translations, language) => {
    const t = (key, section = null) => getTranslation(translations, language, key, section);
    const shortLabels = getShortLabels(work, translations, language);

    return work.criteriaKeys.map((label, index) => {
        return {
            name: label,
            shortName: shortLabels[index],
            [`${t('ki', 'labels')}Score`]: work.aiScores[index],
            [`${t('human', 'labels')}Score`]: work.humanScores[index],
            [`${t('ki', 'labels')}Weight`]: work.aiWeights[index] * 100,
            [`${t('human', 'labels')}Weight`]: work.humanWeights[index] * 100,
            [`${t('ki', 'labels')}Weighted`]: work.aiScores[index] * work.aiWeights[index],
            [`${t('human', 'labels')}Weighted`]: work.humanScores[index] * work.humanWeights[index],
        };
    });
};

// Daten für das Radar/Spinnendiagramm
export const getRadarData = (work, translations, language, chartType) => {
    const t = (key, section = null) => getTranslation(translations, language, key, section);
    const shortLabels = getShortLabels(work, translations, language);

    if (chartType === 'weighted') {
        return work.criteriaKeys.map((label, index) => {
            return {
                subject: label,
                shortSubject: shortLabels[index],
                [t('ki', 'labels')]: work.aiScores[index] * work.aiWeights[index],
                [t('human', 'labels')]: work.humanScores[index] * work.humanWeights[index],
                fullMark: 10,
            };
        });
    } else if (chartType === 'weights') {
        return work.criteriaKeys.map((label, index) => {
            return {
                subject: label,
                shortSubject: shortLabels[index],
                [t('ki', 'labels')]: work.aiWeights[index] * 100,
                [t('human', 'labels')]: work.humanWeights[index] * 100,
                fullMark: 25,
            };
        });
    } else {
        return work.criteriaKeys.map((label, index) => {
            return {
                subject: label,
                shortSubject: shortLabels[index],
                [t('ki', 'labels')]: work.aiScores[index],
                [t('human', 'labels')]: work.humanScores[index],
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

// Übersetzungen für die Daten zu den Arbeiten
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
            typeDesc: typeDesc,
            criteriaLabels,
            criteriaShortLabels
        };
    });
};