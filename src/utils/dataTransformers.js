import { getTranslation } from './translationHelpers';
import { translations } from '../locales/index';
import {METRICS} from "../constants/metrics";
import { getCurrentLanguage } from '../services/languageService';

// Common helper function for all transformation functions
const prepareTranslations = (work) => {
    const language = getCurrentLanguage();
    const t = (key, section = null) => getTranslation(translations, language, key, section);
    const shortLabels = work.criteriaKeys.map(key => {
        const worksTranslations = translations[language]?.works || {};
        return worksTranslations.criteriaShortLabels?.[key] || key;
    });

    return { t, shortLabels };
};

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
    const aiAverage = work.aiScores.reduce((sum, score) => sum + score, 0) / work.aiScores.length;
    const humanAverage = work.humanScores.reduce((sum, score) => sum + score, 0) / work.humanScores.length;

    // Calculate standard deviations
    const aiStdDev = Math.sqrt(
        work.aiScores.reduce((sum, score) => sum + Math.pow(score - aiAverage, 2), 0) / work.aiScores.length
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
        aiAverage,
        humanAverage,
        aiStdDev,
        humanStdDev,
        avgDifference,
        maxDifference,
        minDifference,
        aiWeightedSum,
        humanWeightedSum,
        avgWeightDiff
    };
};

// Data for scores diagram
export const getScoresData = (work) => {
    const { t, shortLabels } = prepareTranslations(work);

    return work.criteriaKeys.map((label, index) => {
        return {
            name: label,
            shortName: shortLabels[index],
            [t('ai', 'labels')]: work.aiScores[index],
            [t('human', 'labels')]: work.humanScores[index],
        };
    });
};

// Data for weightings diagram
export const getWeightsData = (work) => {
    const { t, shortLabels } = prepareTranslations(work);

    return work.criteriaKeys.map((label, index) => ({
        name: label,
        shortName: shortLabels[index],
        [t('ai', 'labels')]: work.aiWeights[index] * METRICS.WEIGHT_SCALE,
        [t('human', 'labels')]: work.humanWeights[index] * METRICS.WEIGHT_SCALE
    }));
};

// Data for weighted points diagram
export const getWeightedData = (work) => {
    const { t, shortLabels } = prepareTranslations(work);

    return work.criteriaKeys.map((label, index) => ({
        name: label,
        shortName: shortLabels[index],
        [t('ai', 'labels')]: work.aiScores[index] * work.aiWeights[index],
        [t('human', 'labels')]: work.humanScores[index] * work.humanWeights[index],
    }));
};

// Data for combined diagram
export const getCombinedData = (work) => {
    const { t, shortLabels } = prepareTranslations(work);

    return work.criteriaKeys.map((label, index) => ({
        name: label,
        shortName: shortLabels[index],
        [`${t('ai', 'labels')}Score`]: work.aiScores[index],
        [`${t('human', 'labels')}Score`]: work.humanScores[index],
        [`${t('ai', 'labels')}Weight`]: work.aiWeights[index] * METRICS.WEIGHT_SCALE,
        [`${t('human', 'labels')}Weight`]: work.humanWeights[index] * METRICS.WEIGHT_SCALE,
        [`${t('ai', 'labels')}Weighted`]: work.aiScores[index] * work.aiWeights[index],
        [`${t('human', 'labels')}Weighted`]: work.humanScores[index] * work.humanWeights[index]
    }));
};

// Data for radar diagram
export const getRadarData = (work, chartType) => {
    const { t, shortLabels } = prepareTranslations(work);

    if (chartType === 'weighted') {
        return work.criteriaKeys.map((label, index) => ({
            subject: label,
            shortSubject: shortLabels[index],
            [t('ai', 'labels')]: work.aiScores[index] * work.aiWeights[index],
            [t('human', 'labels')]: work.humanScores[index] * work.humanWeights[index],
            fullMark: METRICS.WEIGHTED_MAX
        }));
    } else if (chartType === 'weights') {
        return work.criteriaKeys.map((label, index) => ({
            subject: label,
            shortSubject: shortLabels[index],
            [t('ai', 'labels')]: work.aiWeights[index] * 100,
            [t('human', 'labels')]: work.humanWeights[index] * 100,
            fullMark: METRICS.WEIGHT_MAX
        }));
    } else {
        return work.criteriaKeys.map((label, index) => ({
            subject: label,
            shortSubject: shortLabels[index],
            [t('ai', 'labels')]: work.aiScores[index],
            [t('human', 'labels')]: work.humanScores[index],
            fullMark: METRICS.FULL_MARK
        }));
    }
};


// Y-axis domain based on chart type
export const getYDomain = (chartType) => {
    switch(chartType) {
        case 'weights':
            return [0, METRICS.WEIGHT_MAX];
        case 'weighted':
            return [0, METRICS.WEIGHTED_MAX];
        case 'combined':
        case 'scores':
        default:
            return [0, METRICS.FULL_MARK];
    }
};

// Radar domain based on chart type
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

// Translations für the work
export const getTranslatedWorks = (works) => {
    const language = getCurrentLanguage();
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