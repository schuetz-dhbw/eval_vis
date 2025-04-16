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
    const similarity = calculateCosineSimilarity(work.ki_scores, work.human_scores);
    const distance = calculateEuclideanDistance(work.ki_scores, work.human_scores);

    return {
        similarity,
        distance
    };
};

// Calculate statistics for a work
export const calculateStatistics = (work) => {
    // Calculate average scores
    const kiAverage = work.ki_scores.reduce((sum, score) => sum + score, 0) / work.ki_scores.length;
    const humanAverage = work.human_scores.reduce((sum, score) => sum + score, 0) / work.human_scores.length;

    // Calculate standard deviations
    const kiStdDev = Math.sqrt(
        work.ki_scores.reduce((sum, score) => sum + Math.pow(score - kiAverage, 2), 0) / work.ki_scores.length
    );
    const humanStdDev = Math.sqrt(
        work.human_scores.reduce((sum, score) => sum + Math.pow(score - humanAverage, 2), 0) / work.human_scores.length
    );

    // Calculate differences in assessments
    const differences = work.ki_scores.map((score, i) => Math.abs(score - work.human_scores[i]));
    const avgDifference = differences.reduce((sum, diff) => sum + diff, 0) / differences.length;
    const maxDifference = Math.max(...differences);
    const minDifference = Math.min(...differences);

    // Calculate weighted averages
    const kiWeightedSum = work.ki_scores.reduce((sum, score, i) => sum + score * work.ki_weights[i], 0);
    const humanWeightedSum = work.human_scores.reduce((sum, score, i) => sum + score * work.human_weights[i], 0);

    // Calculate differences in weights
    const weightDifferences = work.ki_weights.map((weight, i) =>
        Math.abs(weight - work.human_weights[i])
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
        kiWeightedSum,
        humanWeightedSum,
        avgWeightDiff
    };
};

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