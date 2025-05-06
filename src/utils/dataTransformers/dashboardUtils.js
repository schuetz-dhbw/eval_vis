/**
 * Funktionen für Dashboard-Datenanalysen
 */

import { calculateMean, calculateStdDev } from '../dataUtils';
import { DATA_KEYS } from '../../constants/chartConstants';

/**
 * Berechnet aggregierte Metriken für alle Arbeiten
 * @param {Array} works - Alle Arbeiten
 * @returns {Object} Aggregierte Metriken
 */
export const calculateAggregatedMetrics = (works) => {
    // Globale Metriken
    const aiGrades = works.map(work => work.aiGrade);
    const humanGrades = works.map(work => work.humanGrade);
    const gradeDifferences = works.map(work => Math.abs(work.aiGrade - work.humanGrade));

    // Durchschnittliche Bewertungen für jedes Kriterium über alle Arbeiten
    const criteriaMap = new Map();

    works.forEach(work => {
        work.criteriaKeys.forEach((key, index) => {
            if (!criteriaMap.has(key)) {
                criteriaMap.set(key, {
                    [DATA_KEYS.AI]: [],
                    [DATA_KEYS.HUMAN]: [],
                    aiWeights: [],
                    humanWeights: [],
                    [DATA_KEYS.DIFF]: []
                });
            }

            const data = criteriaMap.get(key);
            data[DATA_KEYS.AI].push(work.aiScores[index]);
            data[DATA_KEYS.HUMAN].push(work.humanScores[index]);
            data.aiWeights.push(work.aiWeights[index]);
            data.humanWeights.push(work.humanWeights[index]);
            data[DATA_KEYS.DIFF].push(Math.abs(work.aiScores[index] - work.humanScores[index]));
        });
    });

    // Durchschnittliche Kriterien-Werte berechnen
    const criteriaAverages = [];
    criteriaMap.forEach((data, key) => {
        criteriaAverages.push({
            key,
            [DATA_KEYS.AI]: calculateMean(data[DATA_KEYS.AI]),
            [DATA_KEYS.HUMAN]: calculateMean(data[DATA_KEYS.HUMAN]),
            [DATA_KEYS.DIFF]: calculateMean(data[DATA_KEYS.DIFF]),
            aiWeightAvg: calculateMean(data.aiWeights),
            humanWeightAvg: calculateMean(data.humanWeights),
            [DATA_KEYS.COUNT]: data[DATA_KEYS.AI].length
        });
    });

    // Nach Differenz sortieren (absteigend)
    criteriaAverages.sort((a, b) => b[DATA_KEYS.DIFF] - a[DATA_KEYS.DIFF]);

    return {
        summary: {
            workCount: works.length,
            avgAiGrade: calculateMean(aiGrades),
            avgHumanGrade: calculateMean(humanGrades),
            avgGradeDifference: calculateMean(gradeDifferences),
            maxGradeDifference: Math.max(...gradeDifferences),
            minGradeDifference: Math.min(...gradeDifferences),
            stdDevAiGrade: calculateStdDev(aiGrades),
            stdDevHumanGrade: calculateStdDev(humanGrades)
        },
        criteriaAverages,
        // Gruppieren nach Arbeitstyp
        byType: groupMetricsByType(works)
    };
};

/**
 * Gruppiert Metriken nach Arbeitstyp
 * @param {Array} works - Alle Arbeiten
 * @returns {Array} - Gruppierte Daten nach Typ
 */
export const groupMetricsByType = (works) => {
    const typeMap = new Map();

    works.forEach(work => {
        if (!typeMap.has(work.typeKey)) {
            typeMap.set(work.typeKey, {
                aiGrades: [],
                humanGrades: [],
                differences: []
            });
        }

        const data = typeMap.get(work.typeKey);
        data.aiGrades.push(work.aiGrade);
        data.humanGrades.push(work.humanGrade);
        data.differences.push(Math.abs(work.aiGrade - work.humanGrade));
    });

    const result = [];
    typeMap.forEach((data, type) => {
        result.push({
            type,
            [DATA_KEYS.AI]: calculateMean(data.aiGrades),
            [DATA_KEYS.HUMAN]: calculateMean(data.humanGrades),
            [DATA_KEYS.DIFF]: calculateMean(data.differences),
            [DATA_KEYS.COUNT]: data.aiGrades.length
        });
    });

    return result;
};

/**
 * Generiert BoxPlot-Daten für Noten
 * @param {Array} works - Alle Arbeiten
 * @returns {Object} - Daten für BoxPlot
 */
export const generateGradeBoxPlotData = (works) => {
    const aiGrades = works.map(work => work.aiGrade);
    const humanGrades = works.map(work => work.humanGrade);

    return [
        {
            name: 'AI',
            min: Math.min(...aiGrades),
            q1: calculateQuantile(aiGrades, 0.25),
            median: calculateQuantile(aiGrades, 0.5),
            q3: calculateQuantile(aiGrades, 0.75),
            max: Math.max(...aiGrades)
        },
        {
            name: 'Human',
            min: Math.min(...humanGrades),
            q1: calculateQuantile(humanGrades, 0.25),
            median: calculateQuantile(humanGrades, 0.5),
            q3: calculateQuantile(humanGrades, 0.75),
            max: Math.max(...humanGrades)
        }
    ];
};

/**
 * Berechnet Quantile für ein Array
 * @param {Array} values - Numerische Werte
 * @param {number} q - Quantil (0-1)
 * @returns {number} - Berechnetes Quantil
 */
const calculateQuantile = (values, q) => {
    const sorted = [...values].sort((a, b) => a - b);
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;

    if (sorted[base + 1] !== undefined) {
        return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    } else {
        return sorted[base];
    }
};