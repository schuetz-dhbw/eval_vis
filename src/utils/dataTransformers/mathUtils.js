/**
 * Grundlegende mathematische Hilfsfunktionen für Datenoperationen
 */

import { dotProduct, vectorNorm } from '../dataUtils';

// Cache für Berechnungen
const calculationCache = {
    cosineSimilarity: new Map(),
    euclideanDistance: new Map(),
};

// Maximale Cache-Größe
const MAX_MATH_CACHE_SIZE = 200;

// Hilfsfunktion zum Verwalten der Cache-Größe
const checkCacheSize = (cacheMap) => {
    if (cacheMap.size > MAX_MATH_CACHE_SIZE) {
        const oldestKey = cacheMap.keys().next().value;
        cacheMap.delete(oldestKey);
    }
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

    checkCacheSize(calculationCache.cosineSimilarity);
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

    checkCacheSize(calculationCache.euclideanDistance);

    // Speichere das Ergebnis im Cache
    calculationCache.euclideanDistance.set(cacheKey, result);

    return result;
};