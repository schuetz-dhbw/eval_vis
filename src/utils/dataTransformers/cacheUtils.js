/**
 * Funktionen für das Caching von Berechnungsergebnissen
 */

import {CACHE_KEYS, CHART_TYPE_KEYS} from '../../constants/chartConstants';

// Allgemeine Cache-Key-Generierung für verschiedene Funktionen
export const generateCacheKey = (work, chartType = null, language = null) => {
    const langKey = language || '';
    if (chartType) {
        return `${work.key}_${chartType}_${langKey}`;
    }
    return `${work.key}_${langKey}`;
};

// Globaler Cache für alle Transformationsfunktionen
export const createCalculationCache = () => ({
    similarityMetrics: new Map(),
    statistics: new Map(),
    scoresData: new Map(),
    weightsData: new Map(),
    weightedData: new Map(),
    combinedData: new Map(),
    radarData: new Map()
});

// Cache-Hilfsfunktionen
export const getFromCacheOrCompute = (cacheMap, cacheKey, computeFunction) => {
    if (cacheMap.has(cacheKey)) {
        return cacheMap.get(cacheKey);
    }

    const result = computeFunction();
    cacheMap.set(cacheKey, result);
    return result;
};

// Gibt die richtige Cache-Map für einen bestimmten Cache-Schlüssel zurück
export const getCacheMapForKey = (calculationCache, cacheKey) => {
    switch(cacheKey) {
        case CACHE_KEYS.SCORES:
            return calculationCache.scoresData;
        case CACHE_KEYS.WEIGHTS:
            return calculationCache.weightsData;
        case CACHE_KEYS.WEIGHTED:
            return calculationCache.weightedData;
        case CACHE_KEYS.COMBINED:
            return calculationCache.combinedData;
        case `${CACHE_KEYS.RADAR}_${CHART_TYPE_KEYS.SCORES}`:
        case `${CACHE_KEYS.RADAR}_${CHART_TYPE_KEYS.WEIGHTS}`:
        case `${CACHE_KEYS.RADAR}_${CHART_TYPE_KEYS.WEIGHTED}`:
        case `${CACHE_KEYS.RADAR}_${CHART_TYPE_KEYS.COMBINED}`:
            return calculationCache.radarData;
        default:
            return null;
    }
};