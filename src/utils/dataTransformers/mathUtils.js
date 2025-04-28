/**
 * Grundlegende mathematische Hilfsfunktionen für Datenoperationen
 */

import { dotProduct, vectorNorm } from '../dataUtils';

// Cache für Berechnungen
const calculationCache = {
    cosineSimilarity: new Map(),
    euclideanDistance: new Map(),
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