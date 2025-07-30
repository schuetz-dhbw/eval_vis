/**
 * Funktionen für statistische Berechnungen und Metriken
 */

import { calculateMean, calculateStdDev, calculateAbsDifferences } from '../dataUtils';
import { METRICS } from '../../constants/metrics';
import { calculateCosineSimilarity, calculateEuclideanDistance } from './mathUtils';
import { generateCacheKey, limitCacheSize } from './cacheUtils';

// Cache für Berechnungen
const calculationCache = {
    similarityMetrics: new Map(),
    statistics: new Map(),
};

// Maximale Cache-Größe
const MAX_STATS_CACHE_SIZE = 50;

/**
 * Calculate the theoretical maximum Euclidean distance for normalization
 * @param {number} numCriteria - Number of criteria being compared
 * @param {number} maxScore - Maximum possible score (default 100)
 * @returns {number} - Theoretical maximum distance
 */
const calculateTheoreticalMaxDistance = (numCriteria, maxScore = METRICS.FULL_MARK) => {
    // Maximum distance occurs when one vector is all 0s and other is all maxScore
    // Distance = sqrt(sum(maxScore^2)) = sqrt(numCriteria * maxScore^2) = maxScore * sqrt(numCriteria)
    return maxScore * Math.sqrt(numCriteria);
};

// Calculate similarity metrics for a work
export const calculateSimilarityMetrics = (work) => {
    const cacheKey = generateCacheKey(work);

    if (calculationCache.similarityMetrics.has(cacheKey)) {
        return calculationCache.similarityMetrics.get(cacheKey);
    }

    const similarity = calculateCosineSimilarity(work.aiScores, work.humanScores);
    const rawDistance = calculateEuclideanDistance(work.aiScores, work.humanScores);

    // Calculate theoretical maximum distance for normalization
    const theoreticalMaxDistance = calculateTheoreticalMaxDistance(work.aiScores.length);

    // Normalize the distance to 0-1 scale
    const normalizedDistance = rawDistance / theoreticalMaxDistance;

    const result = {
        similarity,
        distance: rawDistance,           // Keep raw distance for backward compatibility
        normalizedDistance,              // New normalized distance (0-1 scale)
        theoreticalMaxDistance,          // For reference/debugging
        distanceAsPercentage: normalizedDistance * 100  // As percentage for easier interpretation
    };

    limitCacheSize(calculationCache.similarityMetrics, MAX_STATS_CACHE_SIZE);
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

    limitCacheSize(calculationCache.statistics, MAX_STATS_CACHE_SIZE);
    calculationCache.statistics.set(cacheKey, result);
    return result;
};