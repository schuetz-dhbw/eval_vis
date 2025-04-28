/**
 * Berechnet die Abweichung für einen Datensatz
 * @param {Array<number>} data - Datenpunkte
 * @returns {number} - Abweichungswert
 */
export const calculateDeviation = (data) => {
    const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
    return data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
};

/**
 * Berechnet die Korrelation zwischen zwei Datensätzen
 * @param {Array<number>} x - Erster Datensatz
 * @param {Array<number>} y - Zweiter Datensatz
 * @returns {number} - Korrelationskoeffizient (-1 bis 1)
 */
export const calculateCorrelation = (x, y) => {
    const n = x.length;
    if (n === 0) return 0;

    // Mittelwerte berechnen
    const xMean = x.reduce((sum, val) => sum + val, 0) / n;
    const yMean = y.reduce((sum, val) => sum + val, 0) / n;

    // Korrelationskoeffizient berechnen
    let numerator = 0;
    let xDenominator = 0;
    let yDenominator = 0;

    for (let i = 0; i < n; i++) {
        const xDiff = x[i] - xMean;
        const yDiff = y[i] - yMean;
        numerator += xDiff * yDiff;
        xDenominator += xDiff * xDiff;
        yDenominator += yDiff * yDiff;
    }

    if (xDenominator === 0 || yDenominator === 0) return 0;
    return numerator / Math.sqrt(xDenominator * yDenominator);
};

/**
 * Berechnet den absoluten Unterschied zwischen zwei Scores
 * @param {number} aiScore - AI-Score
 * @param {number} humanScore - Human-Score
 * @returns {number} - Absolute Differenz
 */
export const calculateScoreDifference = (aiScore, humanScore) => {
    return Math.abs(aiScore - humanScore);
};

/**
 * Berechnet die Kriterien-Daten für die Abweichungsanalyse
 * @param {Object} work - Arbeitsobjekt mit Scores und Kriterien
 * @returns {Array} - Aufbereitete Kriteriendaten
 */
export const calculateCriteriaDeviationData = (work) => {
    return work.criteriaKeys.map((label, index) => {
        const aiScore = work.aiScores[index];
        const humanScore = work.humanScores[index];
        return {
            originalKey: label,
            name: work.criteriaLabels[index],
            // Verwende die neue, intuitivere Metrik für die Abweichung
            deviation: calculateScoreDifference(aiScore, humanScore),
            aiScore: aiScore,
            humanScore: humanScore,
            scoreDiff: calculateScoreDifference(aiScore, humanScore)
        };
    }).sort((a, b) => b.deviation - a.deviation);
};

/**
 * Berechnet die Korrelationsdaten zwischen allen Kriterien
 * @param {Object} work - Arbeitsobjekt mit Scores und Kriterien
 * @returns {Array} - Korrelationsdaten für die Darstellung
 */
export const calculateCriteriaCorrelationData = (work) => {
    const result = [];

    for (let i = 0; i < work.criteriaKeys.length; i++) {
        for (let j = i + 1; j < work.criteriaKeys.length; j++) {
            const correlation = calculateCorrelation(
                [work.aiScores[i], work.humanScores[i]],
                [work.aiScores[j], work.humanScores[j]]
            );

            result.push({
                x: i,
                y: j,
                z: Math.abs(correlation) * 100,
                name1: work.criteriaLabels[i],
                name2: work.criteriaLabels[j],
                correlation: correlation.toFixed(2)
            });
        }
    }

    return result;
};