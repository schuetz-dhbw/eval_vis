import { translations } from '../locales/index';
import { METRICS } from "../constants/metrics";
import { getCurrentLanguage } from '../services/languageService';
import {
    dotProduct,
    vectorNorm,
    calculateMean,
    calculateStdDev,
    calculateAbsDifferences
} from './dataUtils';

// Cache für Berechnungen
const calculationCache = {
    cosineSimilarity: new Map(),
    euclideanDistance: new Map(),
    similarityMetrics: new Map(),
    statistics: new Map(),
    scoresData: new Map(),
    weightsData: new Map(),
    weightedData: new Map(),
    combinedData: new Map(),
    radarData: new Map()
};

// Hilfsfunktion zum Generieren von Cache-Keys
const generateCacheKey = (work, chartType = null, language = null) => {
    const langKey = language || getCurrentLanguage();
    if (chartType) {
        return `${work.key}_${chartType}_${langKey}`;
    }
    return `${work.key}_${langKey}`;
};

// Calculate cosine similarity between two vectors
export const calculateCosineSimilarity = (vectorA, vectorB) => {
    // Generiere einen eindeutigen Cache-Key für die Vektoren
    const cacheKey = JSON.stringify({ a: vectorA, b: vectorB });

    // Prüfe, ob das Ergebnis bereits im Cache ist
    if (calculationCache.cosineSimilarity.has(cacheKey)) {
        return calculationCache.cosineSimilarity.get(cacheKey);
    }

    if (vectorA.length !== vectorB.length) {
        console.error('Vectors must be of the same length');
        return 0;
    }

    const product = dotProduct(vectorA, vectorB);
    const normA = vectorNorm(vectorA);
    const normB = vectorNorm(vectorB);

    if (normA === 0 || normB === 0) {
        return 0;
    }

    const result = product / (normA * normB);

    // Speichere das Ergebnis im Cache
    calculationCache.cosineSimilarity.set(cacheKey, result);

    return result;
};

// Calculate Euclidean distance between two vectors
export const calculateEuclideanDistance = (vectorA, vectorB) => {
    // Generiere einen eindeutigen Cache-Key für die Vektoren
    const cacheKey = JSON.stringify({ a: vectorA, b: vectorB });

    // Prüfe, ob das Ergebnis bereits im Cache ist
    if (calculationCache.euclideanDistance.has(cacheKey)) {
        return calculationCache.euclideanDistance.get(cacheKey);
    }

    if (vectorA.length !== vectorB.length) {
        console.error('Vectors must be of the same length');
        return 0;
    }

    const squaredDifferences = vectorA.map((value, index) =>
        Math.pow(value - vectorB[index], 2)
    );

    const result = Math.sqrt(squaredDifferences.reduce((sum, value) => sum + value, 0));

    // Speichere das Ergebnis im Cache
    calculationCache.euclideanDistance.set(cacheKey, result);

    return result;
};

// Calculate similarity metrics for a work
export const calculateSimilarityMetrics = (work) => {
    const cacheKey = generateCacheKey(work);

    if (calculationCache.similarityMetrics.has(cacheKey)) {
        return calculationCache.similarityMetrics.get(cacheKey);
    }

    const similarity = calculateCosineSimilarity(work.aiScores, work.humanScores);
    const distance = calculateEuclideanDistance(work.aiScores, work.humanScores);

    const result = {
        similarity,
        distance
    };

    calculationCache.similarityMetrics.set(cacheKey, result);
    return result;
};

// Calculate statistics for a work
export const calculateStatistics = (work) => {
    const cacheKey = generateCacheKey(work);

    if (calculationCache.statistics.has(cacheKey)) {
        return calculationCache.statistics.get(cacheKey);
    }

    // Calculate average scores
    const aiAverage = calculateMean(work.aiScores);
    const humanAverage = calculateMean(work.humanScores);

    // Calculate standard deviations
    const aiStdDev = calculateStdDev(work.aiScores);
    const humanStdDev = calculateStdDev(work.humanScores);

    // Calculate differences in assessments
    const differences = calculateAbsDifferences(work.aiScores, work.humanScores);
    const avgDifference = calculateMean(differences);
    const maxDifference = Math.max(...differences);
    const minDifference = Math.min(...differences);

    // Calculate weighted averages
    const aiWeightedSum = work.aiScores.reduce((sum, score, i) => sum + score * work.aiWeights[i], 0);
    const humanWeightedSum = work.humanScores.reduce((sum, score, i) => sum + score * work.humanWeights[i], 0);

    // Calculate differences in weights
    const weightDifferences = calculateAbsDifferences(
        work.aiWeights.map(w => w * METRICS.WEIGHT_SCALE),
        work.humanWeights.map(w => w * METRICS.WEIGHT_SCALE)
    );
    const avgWeightDiff = calculateMean(weightDifferences) / METRICS.WEIGHT_SCALE;

    const result = {
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

    calculationCache.statistics.set(cacheKey, result);
    return result;
};

// Data for scores diagram
export const getScoresData = (work, language) => {
    const cacheKey = generateCacheKey(work, 'scores', language);

    if (calculationCache.scoresData.has(cacheKey)) {
        return calculationCache.scoresData.get(cacheKey);
    }

    // Die Übersetzungsfunktion mit der übergebenen Sprache aufrufen
    const shortLabels = work.criteriaKeys.map(key => {
        const worksTranslations = translations[language]?.works || {};
        return worksTranslations.criteriaShortLabels?.[key] || key;
    });

    const result = work.criteriaKeys.map((label, index) => {
        return {
            name: label,
            shortName: shortLabels[index],
            ai: work.aiScores[index],     // Konstanter Key "ai"
            human: work.humanScores[index] // Konstanter Key "human"
        };
    });

    calculationCache.scoresData.set(cacheKey, result);
    return result;
};

// Data for weightings diagram
export const getWeightsData = (work, language) => {
    const cacheKey = generateCacheKey(work, 'weights', language);

    if (calculationCache.weightsData.has(cacheKey)) {
        return calculationCache.weightsData.get(cacheKey);
    }

    // Die Übersetzungsfunktion mit der übergebenen Sprache aufrufen
    const shortLabels = work.criteriaKeys.map(key => {
        const worksTranslations = translations[language]?.works || {};
        return worksTranslations.criteriaShortLabels?.[key] || key;
    });

    const result = work.criteriaKeys.map((label, index) => ({
        name: label,
        shortName: shortLabels[index],
        ai: work.aiScores[index] * METRICS.WEIGHT_SCALE,     // Konstanter Key "ai"
        human: work.humanScores[index] * METRICS.WEIGHT_SCALE // Konstanter Key "human"
    }));

    calculationCache.weightsData.set(cacheKey, result);
    return result;
};

// Data for weighted points diagram
export const getWeightedData = (work, language) => {
    const cacheKey = generateCacheKey(work, 'weighted', language);

    if (calculationCache.weightedData.has(cacheKey)) {
        return calculationCache.weightedData.get(cacheKey);
    }

    // Die Übersetzungsfunktion mit der übergebenen Sprache aufrufen
    const shortLabels = work.criteriaKeys.map(key => {
        const worksTranslations = translations[language]?.works || {};
        return worksTranslations.criteriaShortLabels?.[key] || key;
    });

    const result = work.criteriaKeys.map((label, index) => ({
        name: label,
        shortName: shortLabels[index],
        ai: work.aiScores[index] * work.aiWeights[index],     // Konstanter Key "ai"
        human: work.humanScores[index] * work.humanWeights[index] // Konstanter Key "human"
    }));

    calculationCache.weightedData.set(cacheKey, result);
    return result;
};

// Data for combined diagram
export const getCombinedData = (work, language) => {
    const cacheKey = generateCacheKey(work, 'combined');

    if (calculationCache.combinedData.has(cacheKey)) {
        return calculationCache.combinedData.get(cacheKey);
    }

    // Die Übersetzungsfunktion mit der übergebenen Sprache aufrufen
    const shortLabels = work.criteriaKeys.map(key => {
        const worksTranslations = translations[language]?.works || {};
        return worksTranslations.criteriaShortLabels?.[key] || key;
    });

    const result = work.criteriaKeys.map((label, index) => ({
        name: label,
        shortName: shortLabels[index],
        aiScore: work.aiScores[index],
        humanScore: work.humanScores[index],
        aiWeight: work.aiWeights[index] * METRICS.WEIGHT_SCALE,
        humanWeight: work.humanWeights[index] * METRICS.WEIGHT_SCALE,
        aiWeighted: work.aiScores[index] * work.aiWeights[index],
        humanWeighted: work.humanScores[index] * work.humanWeights[index]
    }));

    calculationCache.combinedData.set(cacheKey, result);
    return result;
};

// Data for radar diagram
export const getRadarData = (work, chartType, language) => {
    const cacheKey = generateCacheKey(work, `radar_${chartType}`, language);

    if (calculationCache.radarData.has(cacheKey)) {
        return calculationCache.radarData.get(cacheKey);
    }

    // Die Übersetzungsfunktion mit der übergebenen Sprache aufrufen
    const shortLabels = work.criteriaKeys.map(key => {
        const worksTranslations = translations[language]?.works || {};
        return worksTranslations.criteriaShortLabels?.[key] || key;
    });

    let result;

    if (chartType === 'weighted') {
        result = work.criteriaKeys.map((label, index) => ({
            subject: label,
            shortSubject: shortLabels[index],
            ai: work.aiScores[index] * work.aiWeights[index],
            human: work.humanScores[index] * work.humanWeights[index],
            fullMark: METRICS.WEIGHTED_MAX
        }));
    } else if (chartType === 'weights') {
        result = work.criteriaKeys.map((label, index) => ({
            subject: label,
            shortSubject: shortLabels[index],
            ai: work.aiWeights[index] * 100,
            human: work.humanWeights[index] * 100,
            fullMark: METRICS.WEIGHT_MAX
        }));
    } else {
        result = work.criteriaKeys.map((label, index) => ({
            subject: label,
            shortSubject: shortLabels[index],
            ai: work.aiScores[index],
            human: work.humanScores[index],
            fullMark: METRICS.FULL_MARK
        }));
    }

    calculationCache.radarData.set(cacheKey, result);
    return result;
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