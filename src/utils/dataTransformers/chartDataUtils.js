/**
 * Funktionen zur Transformation von Daten für Charts
 */

import { METRICS } from "../../constants/metrics";
import {DATA_KEYS, CACHE_KEYS } from "../../constants/chartConstants";
import { generateCacheKey, getFromCacheOrCompute, getCacheMapForKey } from './cacheUtils';
import { getTranslatedLabels } from './translationUtils';

// Cache für Berechnungen
const calculationCache = {
    scoresData: new Map(),
    weightsData: new Map(),
    weightedData: new Map(),
    combinedData: new Map(),
    radarData: new Map()
};

// Generische Funktion zum Erstellen von Chart-Daten mit verschiedenen Mapping-Funktionen
const createChartData = (work, language, cacheKey, mappingFunction) => {
    const fullCacheKey = generateCacheKey(work, cacheKey, language);
    const cacheMap = getCacheMapForKey(calculationCache, cacheKey);

    if (!cacheMap) {
        console.error(`No cache map found for key: ${cacheKey}`);
        return [];
    }

    return getFromCacheOrCompute(cacheMap, fullCacheKey, () => {
        const shortLabels = getTranslatedLabels(work, language);
        return work.criteriaKeys.map((label, index) =>
            mappingFunction(label, index, shortLabels[index], work)
        );
    });
};

// Data for scores diagram
export const getScoresData = (work, language) => {
    return createChartData(
        work,
        language,
        CACHE_KEYS.SCORES,
        (label, index, shortLabel, work) => ({
            [DATA_KEYS.NAME]: label,
            [DATA_KEYS.SHORT_NAME]: shortLabel,
            [DATA_KEYS.AI]: work.aiScores[index],
            [DATA_KEYS.HUMAN]: work.humanScores[index]
        })
    );
};

// Data for weightings diagram
export const getWeightsData = (work, language) => {
    return createChartData(
        work,
        language,
        CACHE_KEYS.WEIGHTS,
        (label, index, shortLabel, work) => ({
            [DATA_KEYS.NAME]: label,
            [DATA_KEYS.SHORT_NAME]: shortLabel,
            [DATA_KEYS.AI]: work.aiWeights[index] * METRICS.WEIGHT_SCALE,
            [DATA_KEYS.HUMAN]: work.humanWeights[index] * METRICS.WEIGHT_SCALE
        })
    );
};

// Data for weighted points diagram
export const getWeightedData = (work, language) => {
    return createChartData(
        work,
        language,
        CACHE_KEYS.WEIGHTED,
        (label, index, shortLabel, work) => ({
            [DATA_KEYS.NAME]: label,
            [DATA_KEYS.SHORT_NAME]: shortLabel,
            [DATA_KEYS.AI]: work.aiScores[index] * work.aiWeights[index],
            [DATA_KEYS.HUMAN]: work.humanScores[index] * work.humanWeights[index]
        })
    );
};

// Data for combined diagram
export const getCombinedData = (work, language) => {
    return createChartData(
        work,
        language,
        CACHE_KEYS.COMBINED,
        (label, index, shortLabel, work) => ({
            [DATA_KEYS.NAME]: label,
            [DATA_KEYS.SHORT_NAME]: shortLabel,
            [DATA_KEYS.AI_SCORE]: work.aiScores[index],
            [DATA_KEYS.HUMAN_SCORE]: work.humanScores[index],
            [DATA_KEYS.AI_WEIGHT]: work.aiWeights[index] * METRICS.WEIGHT_SCALE,
            [DATA_KEYS.HUMAN_WEIGHT]: work.humanWeights[index] * METRICS.WEIGHT_SCALE,
            [DATA_KEYS.AI_WEIGHTED]: work.aiScores[index] * work.aiWeights[index],
            [DATA_KEYS.HUMAN_WEIGHTED]: work.humanScores[index] * work.humanWeights[index]
        })
    );
};