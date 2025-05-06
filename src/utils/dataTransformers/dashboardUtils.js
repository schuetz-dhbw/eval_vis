import { calculateMean, calculateStdDev } from '../dataUtils';
import { DATA_KEYS } from '../../constants/chartConstants';
import { generateCacheKey, limitCacheSize } from './cacheUtils';

// Maximale Cache-Größe
const MAX_DASHBOARD_CACHE_SIZE = 50;

// Cache für Berechnungen
const dashboardCache = {
    aggregatedMetrics: new Map(),
    gradeBoxPlot: new Map(),
    violinPlot: new Map(),
    parallelCoordinate: new Map(),
    rankAnalysis: new Map()
};

/**
 * Berechnet aggregierte Metriken für alle Arbeiten
 * @param {Array} works - Alle Arbeiten
 * @returns {Object} Aggregierte Metriken
 */
export const calculateAggregatedMetrics = (works) => {
    const cacheKey = generateCacheKey(works);

    if (dashboardCache.aggregatedMetrics.has(cacheKey)) {
        return dashboardCache.aggregatedMetrics.get(cacheKey);
    }

    // Globale Metriken
    const aiGrades = works.map(work => work.aiGrade);
    const humanGrades = works.map(work => work.humanGrade);
    const gradeDifferences = works.map(work => Math.abs(work.aiGrade - work.humanGrade));

    // Arbeitstypen zählen
    const analyticalWorks = works.filter(work => work.typeKey === 'analytic').length;
    const constructiveWorks = works.filter(work => work.typeKey === 'constructive').length;

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

    const result = {
        summary: {
            workCount: works.length,
            avgAiGrade: calculateMean(aiGrades),
            avgHumanGrade: calculateMean(humanGrades),
            avgGradeDifference: calculateMean(gradeDifferences),
            maxGradeDifference: Math.max(...gradeDifferences),
            minGradeDifference: Math.min(...gradeDifferences),
            stdDevAiGrade: calculateStdDev(aiGrades),
            stdDevHumanGrade: calculateStdDev(humanGrades),
            minAiGrade: Math.min(...aiGrades),
            maxAiGrade: Math.max(...aiGrades),
            minHumanGrade: Math.min(...humanGrades),
            maxHumanGrade: Math.max(...humanGrades),
            analyticalWorks,
            constructiveWorks,
            analyticalWorksPercentage: Math.round((analyticalWorks / works.length) * 100),
            constructiveWorksPercentage: Math.round((constructiveWorks / works.length) * 100)
        },
        criteriaAverages,
        // Gruppieren nach Arbeitstyp
        byType: groupMetricsByType(works)
    };

    // Cache-Größe limitieren und Ergebnis cachen
    limitCacheSize(dashboardCache.aggregatedMetrics, MAX_DASHBOARD_CACHE_SIZE);
    dashboardCache.aggregatedMetrics.set(cacheKey, result);

    return result;
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
    const cacheKey = generateCacheKey(works);

    if (dashboardCache.gradeBoxPlot.has(cacheKey)) {
        return dashboardCache.gradeBoxPlot.get(cacheKey);
    }

    const aiGrades = works.map(work => work.aiGrade);
    const humanGrades = works.map(work => work.humanGrade);

    const result = [
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

    // Cache-Größe limitieren und Ergebnis cachen
    limitCacheSize(dashboardCache.gradeBoxPlot, MAX_DASHBOARD_CACHE_SIZE);
    dashboardCache.gradeBoxPlot.set(cacheKey, result);

    return result;
};

/**
 * Berechnet Daten für Violin-Plot der Notenverteilung
 * @param {Array} works - Alle Arbeiten
 * @returns {Object} - Violin-Plot Daten
 */
export const generateViolinPlotData = (works) => {
    const cacheKey = generateCacheKey(works);

    if (dashboardCache.violinPlot.has(cacheKey)) {
        return dashboardCache.violinPlot.get(cacheKey);
    }

    const aiGrades = works.map(work => work.aiGrade);
    const humanGrades = works.map(work => work.humanGrade);

    // Bereich bestimmen (Min bis Max mit etwas Buffer)
    const min = Math.floor(Math.min(...aiGrades, ...humanGrades));
    const max = Math.ceil(Math.max(...aiGrades, ...humanGrades));

    // Bins für die Dichteverteilung erstellen
    const binCount = 10;
    const binSize = (max - min) / binCount;

    // Histogramm Funktion
    const createHistogram = (values) => {
        const histogram = Array(binCount).fill(0);
        values.forEach(value => {
            const binIndex = Math.min(binCount - 1, Math.floor((value - min) / binSize));
            histogram[binIndex]++;
        });

        // Normalisieren für die Darstellung
        const maxCount = Math.max(...histogram);
        return histogram.map(count => count / maxCount);
    };

    // BoxPlot-Statistiken mitliefern (wiederverwenden was wir schon haben)
    const boxPlotData = generateGradeBoxPlotData(works);

    const result = {
        aiDensity: createHistogram(aiGrades),
        humanDensity: createHistogram(humanGrades),
        aiStats: boxPlotData[0],
        humanStats: boxPlotData[1],
        min,
        max,
        binCount,
        aiGrades: aiGrades,
        humanGrades: humanGrades
    };

    // Cache-Größe limitieren und Ergebnis cachen
    limitCacheSize(dashboardCache.violinPlot, MAX_DASHBOARD_CACHE_SIZE);
    dashboardCache.violinPlot.set(cacheKey, result);

    return result;
};

/**
 * Generiert Daten für Parallel Coordinate Plot
 * @param {Array} works - Alle Arbeiten
 * @returns {Array} - Daten für Parallel Coordinate Plot
 */
export const generateParallelCoordinateData = (works) => {
    const cacheKey = generateCacheKey(works);

    if (dashboardCache.parallelCoordinate.has(cacheKey)) {
        return dashboardCache.parallelCoordinate.get(cacheKey);
    }

    const result = works.map(work => ({
        id: work.key,
        title: work.title || work.key,
        aiGrade: work.aiGrade,
        humanGrade: work.humanGrade,
        // Differenz für Farbkodierung
        difference: Math.abs(work.aiGrade - work.humanGrade)
    }));

    // Cache-Größe limitieren und Ergebnis cachen
    limitCacheSize(dashboardCache.parallelCoordinate, MAX_DASHBOARD_CACHE_SIZE);
    dashboardCache.parallelCoordinate.set(cacheKey, result);

    return result;
};

/**
 * Berechnet Rangdaten für alle Arbeiten
 * @param {Array} works - Alle Arbeiten
 * @returns {Object} - Rangdaten und Korrelation
 */
export const calculateRankAnalysis = (works) => {
    const cacheKey = generateCacheKey(works);

    if (dashboardCache.rankAnalysis.has(cacheKey)) {
        return dashboardCache.rankAnalysis.get(cacheKey);
    }

    // Arbeiten nach AI- und Human-Noten sortieren
    const aiSorted = [...works].sort((a, b) => a.aiGrade - b.aiGrade);
    const humanSorted = [...works].sort((a, b) => a.humanGrade - b.humanGrade);

    // Ränge zuweisen (1 = beste Note)
    const ranks = works.map(work => {
        const aiRank = aiSorted.findIndex(w => w.key === work.key) + 1;
        const humanRank = humanSorted.findIndex(w => w.key === work.key) + 1;
        const rankDiff = aiRank - humanRank;

        return {
            key: work.key,
            title: work.title || work.key,
            aiGrade: work.aiGrade,
            humanGrade: work.humanGrade,
            aiRank,
            humanRank,
            rankDiff,
            absDiff: Math.abs(rankDiff)
        };
    });

    // Berechne Spearman-Rangkorrelation
    // ρ = 1 - (6 * Σd²) / (n * (n² - 1))
    // wobei d die Differenz der Ränge und n die Anzahl der Beobachtungen ist
    const n = works.length;
    const sumSquaredDiff = ranks.reduce((sum, item) => sum + Math.pow(item.rankDiff, 2), 0);
    const spearmanCoefficient = 1 - (6 * sumSquaredDiff) / (n * (Math.pow(n, 2) - 1));

    // Sortieren nach absoluter Rangdifferenz für Visualisierung
    const sortedByDiff = [...ranks].sort((a, b) => b.absDiff - a.absDiff);

    const result = {
        ranks,
        topDifferenceItems: sortedByDiff.slice(0, 10), // Top 10 mit größten Differenzen
        spearmanCoefficient,
        // Interpretation der Korrelation
        correlationStrength:
            Math.abs(spearmanCoefficient) > 0.8 ? 'strong' :
                Math.abs(spearmanCoefficient) > 0.5 ? 'moderate' : 'weak'
    };

    // Cache-Größe limitieren und Ergebnis cachen
    limitCacheSize(dashboardCache.rankAnalysis, MAX_DASHBOARD_CACHE_SIZE);
    dashboardCache.rankAnalysis.set(cacheKey, result);

    return result;
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