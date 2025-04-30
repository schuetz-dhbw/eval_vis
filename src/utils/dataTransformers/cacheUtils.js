/**
 * Funktionen für das Caching von Berechnungsergebnissen
 */

import {CACHE_KEYS, ANALYSIS_TYPES} from '../../constants/chartConstants';

// Maximale Cache-Größe
const MAX_CACHE_SIZE = 100;

// Allgemeine Cache-Key-Generierung für verschiedene Funktionen
export const generateCacheKey = (work, analysisType = null, language = null) => {
    const langKey = language || '';
    if (analysisType) {
        return `${work.key}_${analysisType}_${langKey}`;
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

// Hilfsfunktion zur Implementierung einer einfachen LRU-Cache-Strategie
export const limitCacheSize = (cacheMap, maxSize = MAX_CACHE_SIZE) => {
    if (cacheMap.size > maxSize) {
        // Einfache LRU-Implementation: Entferne den ältesten Eintrag
        const oldestKey = cacheMap.keys().next().value;
        cacheMap.delete(oldestKey);
    }
};

// Cache-Hilfsfunktionen
export const getFromCacheOrCompute = (cacheMap, cacheKey, computeFunction) => {
    // Wenn im Cache vorhanden, ergebnis zurückgeben und als "zuletzt verwendet" markieren
    if (cacheMap.has(cacheKey)) {
        const value = cacheMap.get(cacheKey);
        // Aktualisiere LRU-Status, indem der Eintrag entfernt und neu eingefügt wird
        cacheMap.delete(cacheKey);
        cacheMap.set(cacheKey, value);
        return value;
    }

    // Sonst berechnen, cachen und zurückgeben
    const result = computeFunction();

    // Cache-Größe limitieren bevor neuer Wert eingefügt wird
    limitCacheSize(cacheMap);

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
        case `${CACHE_KEYS.RADAR}_${ANALYSIS_TYPES.SCORES}`:
        case `${CACHE_KEYS.RADAR}_${ANALYSIS_TYPES.WEIGHTS}`:
        case `${CACHE_KEYS.RADAR}_${ANALYSIS_TYPES.WEIGHTED}`:
        case `${CACHE_KEYS.RADAR}_${ANALYSIS_TYPES.COMBINED}`:
            return calculationCache.radarData;
        default:
            return null;
    }
};