// src/utils/dataTransformers/enhancedCriteriaUtils.js

import { calculateMean } from '../dataUtils';
import { DATA_KEYS } from '../../constants/chartConstants';

/**
 * Analyzes criteria with enhanced logic for weight-aware comparisons
 * @param {Array} works - All works to analyze
 * @returns {Object} Enhanced criteria analysis data
 */
export const calculateEnhancedCriteriaMetrics = (works) => {
    if (!works || works.length === 0) {
        console.log('No works provided to calculateEnhancedCriteriaMetrics');
        return null;
    }

    const criteriaMap = new Map();

    // Initialize data structures - get all unique criteria keys first
    const allCriteriaKeys = new Set();
    works.forEach(work => {
        if (work.criteriaKeys && Array.isArray(work.criteriaKeys)) {
            work.criteriaKeys.forEach(key => allCriteriaKeys.add(key));
        }
    });

    // Initialize map for all criteria
    allCriteriaKeys.forEach(key => {
        criteriaMap.set(key, {
            validComparisons: [], // Both weights > 0
            aiScores: [],
            humanScores: [],
            weightDifferences: [],
            aiOnlyWeighted: 0,
            humanOnlyWeighted: 0,
            bothZeroWeight: 0,
            totalWorks: 0
        });
    });

    // Process each work
    works.forEach(work => {
        if (!work.criteriaKeys || !Array.isArray(work.criteriaKeys)) {
            console.warn('Work missing criteriaKeys:', work);
            return;
        }

        work.criteriaKeys.forEach((key, index) => {
            // Validate that we have all required data
            if (!work.aiScores || !work.humanScores || !work.aiWeights || !work.humanWeights) {
                console.warn('Work missing score/weight arrays:', work.key || 'unknown');
                return;
            }

            if (index >= work.aiScores.length || index >= work.humanScores.length ||
                index >= work.aiWeights.length || index >= work.humanWeights.length) {
                console.warn('Index out of bounds for work:', work.key || 'unknown', 'index:', index);
                return;
            }

            const aiScore = work.aiScores[index];
            const humanScore = work.humanScores[index];
            const aiWeight = work.aiWeights[index];
            const humanWeight = work.humanWeights[index];

            // Validate numeric values
            if (typeof aiScore !== 'number' || typeof humanScore !== 'number' ||
                typeof aiWeight !== 'number' || typeof humanWeight !== 'number') {
                console.warn('Non-numeric values found in work:', work.key || 'unknown', 'criterion:', key);
                return;
            }

            const data = criteriaMap.get(key);
            if (!data) {
                console.warn('Criterion not found in map:', key);
                return;
            }

            data.totalWorks++;

            // Categorize based on weighting patterns
            const aiWeighted = aiWeight > 0;
            const humanWeighted = humanWeight > 0;

            if (aiWeighted && humanWeighted) {
                // Both evaluators consider this criterion relevant
                data.validComparisons.push({
                    aiScore,
                    humanScore,
                    aiWeight,
                    humanWeight,
                    scoreDifference: Math.abs(aiScore - humanScore),
                    weightDifference: Math.abs(aiWeight - humanWeight)
                });
                data.aiScores.push(aiScore);
                data.humanScores.push(humanScore);
                data.weightDifferences.push(Math.abs(aiWeight - humanWeight));
            } else if (aiWeighted && !humanWeighted) {
                data.aiOnlyWeighted++;
            } else if (!aiWeighted && humanWeighted) {
                data.humanOnlyWeighted++;
            } else {
                data.bothZeroWeight++;
            }
        });
    });

    console.log('Criteria map after processing:', criteriaMap);

    // Calculate metrics for valid comparisons only
    const validCriteriaAverages = [];
    const weightingDisagreementStats = [];
    const zeroWeightAnalysis = [];

    criteriaMap.forEach((data, key) => {
        const validCount = data.validComparisons.length;

        console.log(`Processing criterion ${key}:`, {
            validCount,
            totalWorks: data.totalWorks,
            aiOnlyWeighted: data.aiOnlyWeighted,
            humanOnlyWeighted: data.humanOnlyWeighted,
            bothZeroWeight: data.bothZeroWeight
        });

        if (validCount > 0) {
            // Calculate averages for valid comparisons
            const avgAiScore = calculateMean(data.aiScores);
            const avgHumanScore = calculateMean(data.humanScores);
            const avgScoreDifference = calculateMean(
                data.validComparisons.map(comp => comp.scoreDifference)
            );
            const avgWeightDifference = calculateMean(data.weightDifferences);

            validCriteriaAverages.push({
                key,
                [DATA_KEYS.AI]: avgAiScore,
                [DATA_KEYS.HUMAN]: avgHumanScore,
                [DATA_KEYS.DIFF]: avgScoreDifference,
                avgWeightDiff: avgWeightDifference,
                validComparisons: validCount,
                [DATA_KEYS.COUNT]: data.totalWorks
            });
        }

        // Weighting disagreement analysis
        const disagreementRate = (data.aiOnlyWeighted + data.humanOnlyWeighted) / data.totalWorks;
        if (disagreementRate > 0) {
            weightingDisagreementStats.push({
                key,
                aiOnlyWeighted: data.aiOnlyWeighted,
                humanOnlyWeighted: data.humanOnlyWeighted,
                disagreementRate,
                totalWorks: data.totalWorks,
                aiOnlyPercentage: (data.aiOnlyWeighted / data.totalWorks) * 100,
                humanOnlyPercentage: (data.humanOnlyWeighted / data.totalWorks) * 100
            });
        }

        // Zero weight analysis
        const zeroWeightRate = data.bothZeroWeight / data.totalWorks;
        zeroWeightAnalysis.push({
            key,
            bothZeroWeight: data.bothZeroWeight,
            zeroWeightRate,
            relevanceRate: validCount / data.totalWorks,
            totalWorks: data.totalWorks,
            validComparisons: validCount
        });
    });

    console.log('Final results:', {
        validCriteriaAverages: validCriteriaAverages.length,
        weightingDisagreementStats: weightingDisagreementStats.length,
        zeroWeightAnalysis: zeroWeightAnalysis.length
    });

    // Sort arrays by relevant metrics
    validCriteriaAverages.sort((a, b) => b[DATA_KEYS.DIFF] - a[DATA_KEYS.DIFF]);
    weightingDisagreementStats.sort((a, b) => b.disagreementRate - a.disagreementRate);
    zeroWeightAnalysis.sort((a, b) => b.zeroWeightRate - a.zeroWeightRate);

    return {
        validCriteriaAverages,
        weightingDisagreementStats,
        zeroWeightAnalysis,
        summary: {
            totalCriteria: criteriaMap.size,
            avgValidComparisons: calculateMean(
                Array.from(criteriaMap.values()).map(data => data.validComparisons.length)
            ),
            criteriaWithDisagreements: weightingDisagreementStats.length,
            criteriaOftenIgnored: zeroWeightAnalysis.filter(item => item.zeroWeightRate > 0.5).length
        }
    };
};

/**
 * Enhanced section comparison with weight-aware logic
 * @param {Array} works - All works to analyze
 * @param {Object} criteriaSections - Section definitions
 * @returns {Array} Section comparison data
 */
export const calculateEnhancedSectionMetrics = (works, criteriaSections) => {
    if (!works || works.length === 0) return [];

    const sectionStats = {};

    // Initialize sections
    Object.keys(criteriaSections).forEach(sectionKey => {
        sectionStats[sectionKey] = {
            validComparisons: [],
            weightingDisagreements: 0,
            totalEvaluations: 0
        };
    });

    // Process each work
    works.forEach(work => {
        work.criteriaKeys.forEach((key, index) => {
            const sectionKey = Object.keys(criteriaSections).find(section =>
                criteriaSections[section].includes(key)
            );

            if (!sectionKey || !sectionStats[sectionKey]) return;

            const aiScore = work.aiScores[index];
            const humanScore = work.humanScores[index];
            const aiWeight = work.aiWeights[index];
            const humanWeight = work.humanWeights[index];

            const stats = sectionStats[sectionKey];
            stats.totalEvaluations++;

            const aiWeighted = aiWeight > 0;
            const humanWeighted = humanWeight > 0;

            if (aiWeighted && humanWeighted) {
                // Valid comparison - both evaluators consider it relevant
                stats.validComparisons.push({
                    aiScore,
                    humanScore,
                    difference: Math.abs(aiScore - humanScore)
                });
            } else if (aiWeighted !== humanWeighted) {
                // Disagreement on relevance
                stats.weightingDisagreements++;
            }
        });
    });

    // Calculate section metrics
    return Object.keys(sectionStats)
        .filter(sectionKey => sectionStats[sectionKey].validComparisons.length > 0)
        .map(sectionKey => {
            const stats = sectionStats[sectionKey];
            const validComps = stats.validComparisons;

            return {
                key: sectionKey,
                [DATA_KEYS.AI]: calculateMean(validComps.map(c => c.aiScore)),
                [DATA_KEYS.HUMAN]: calculateMean(validComps.map(c => c.humanScore)),
                [DATA_KEYS.DIFF]: calculateMean(validComps.map(c => c.difference)),
                validComparisons: validComps.length,
                weightingDisagreements: stats.weightingDisagreements,
                totalEvaluations: stats.totalEvaluations,
                relevanceRate: validComps.length / stats.totalEvaluations,
                disagreementRate: stats.weightingDisagreements / stats.totalEvaluations
            };
        })
        .sort((a, b) => b[DATA_KEYS.DIFF] - a[DATA_KEYS.DIFF]);
};