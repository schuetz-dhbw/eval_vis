/**
 * Grundlegende Hilfsfunktionen für Datenoperationen
 * Diese Funktionen werden von dataTransformers/... verwendet
 */

/**
 * Berechnet das Skalarprodukt zweier Vektoren
 * @param {Array<number>} vectorA - Erster Vektor
 * @param {Array<number>} vectorB - Zweiter Vektor
 * @returns {number} - Skalarprodukt
 */
export const dotProduct = (vectorA, vectorB) => {
    if (vectorA.length !== vectorB.length) {
        console.error('Vektoren müssen die gleiche Länge haben');
        return 0;
    }

    return vectorA.reduce((sum, value, index) => sum + value * vectorB[index], 0);
};

/**
 * Berechnet die Norm (Länge) eines Vektors
 * @param {Array<number>} vector - Eingangsvektor
 * @returns {number} - Norm des Vektors
 */
export const vectorNorm = (vector) => {
    return Math.sqrt(dotProduct(vector, vector));
};

/**
 * Berechnet den Mittelwert eines Arrays
 * @param {Array<number>} values - Array von Zahlenwerten
 * @returns {number} - Mittelwert
 */
export const calculateMean = (values) => {
    if (!values.length) return 0;
    return values.reduce((sum, val) => sum + val, 0) / values.length;
};

/**
 * Berechnet die Standardabweichung eines Arrays
 * @param {Array<number>} values - Array von Zahlenwerten
 * @returns {number} - Standardabweichung
 */
export const calculateStdDev = (values) => {
    if (!values.length) return 0;
    const mean = calculateMean(values);
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    return Math.sqrt(calculateMean(squaredDiffs));
};

/**
 * Berechnet die absolute Differenz zwischen zwei Arrays elementweise
 * @param {Array<number>} arrayA - Erstes Array
 * @param {Array<number>} arrayB - Zweites Array
 * @returns {Array<number>} - Array der absoluten Differenzen
 */
export const calculateAbsDifferences = (arrayA, arrayB) => {
    if (arrayA.length !== arrayB.length) {
        console.error('Arrays müssen die gleiche Länge haben');
        return [];
    }

    return arrayA.map((val, index) => Math.abs(val - arrayB[index]));
};

/**
 * Formatiert einen Zahlenwert mit einer bestimmten Anzahl von Dezimalstellen
 * @param {number} value - Zu formatierender Wert
 * @param {number} decimalPlaces - Anzahl der Dezimalstellen (Standard: 2)
 * @returns {string} - Formatierter Wert als String
 */
export const formatNumber = (value, decimalPlaces = 2) => {
    return Number(value).toFixed(decimalPlaces);
};

/**
 * Hilfsfunktion zum sicheren Zugriff auf verschachtelte Objekte
 * @param {Object} obj - Objekt, auf das zugegriffen werden soll
 * @param {string} path - Pfad zum gewünschten Wert, mit Punktnotation
 * @param {*} defaultValue - Standardwert, wenn Pfad nicht existiert
 * @returns {*} - Wert am angegebenen Pfad oder Standardwert
 */
export const getNestedValue = (obj, path, defaultValue = null) => {
    if (!obj || !path) return defaultValue;

    const keys = path.split('.');
    let result = obj;

    for (const key of keys) {
        if (result === undefined || result === null || !Object.prototype.hasOwnProperty.call(result, key)) {
            return defaultValue;
        }
        result = result[key];
    }

    return result === undefined ? defaultValue : result;
};