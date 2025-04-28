/**
 * Gruppiert Arbeiten nach ihrem Typ
 * @param {Array} works - Array aller Arbeiten
 * @returns {Object} - Arbeiten gruppiert nach Typ
 */
export const groupWorksByType = (works) => {
    const result = {};
    works.forEach(work => {
        if (!result[work.typeKey]) {
            result[work.typeKey] = [];
        }
        result[work.typeKey].push(work);
    });
    return result;
};

/**
 * Berechnet die durchschnittlichen Unterschiede nach Kriterien für jeden Typ
 * @param {Object} groupedWorks - Nach Typ gruppierte Arbeiten
 * @returns {Array} - Unterschiede je Kriterium und Typ
 */
export const calculateDifferencesByType = (groupedWorks) => {
    const result = [];

    Object.entries(groupedWorks).forEach(([typeKey, typeWorks]) => {
        if (typeWorks.length > 0) {
            const criteriaCount = typeWorks[0].criteriaKeys.length;

            for (let i = 0; i < criteriaCount; i++) {
                let totalDiff = 0;
                let validWorkCount = 0;

                typeWorks.forEach(work => {
                    const diff = Math.abs(work.aiScores[i] - work.humanScores[i]);
                    if (!isNaN(diff)) {
                        totalDiff += diff;
                        validWorkCount++;
                    }
                });

                if (validWorkCount > 0) {
                    result.push({
                        type: typeKey,
                        criterion: typeWorks[0].criteriaKeys[i],
                        averageDifference: totalDiff / validWorkCount,
                        count: validWorkCount
                    });
                }
            }
        }
    });

    return result;
};

/**
 * Berechnet den durchschnittlichen Unterschied nach Arbeitstyp
 * @param {Object} groupedWorks - Nach Typ gruppierte Arbeiten
 * @param {Function} translate - Übersetzungsfunktion
 * @returns {Array} - Durchschnittliche Unterschiede je Typ
 */
export const calculateOverallDifferenceByType = (groupedWorks, translate) => {
    const result = [];

    Object.entries(groupedWorks).forEach(([typeKey, typeWorks]) => {
        let totalDiff = 0;
        let diffCount = 0;

        typeWorks.forEach(work => {
            for (let i = 0; i < work.aiScores.length; i++) {
                const diff = Math.abs(work.aiScores[i] - work.humanScores[i]);
                if (!isNaN(diff)) {
                    totalDiff += diff;
                    diffCount++;
                }
            }
        });

        if (diffCount > 0) {
            result.push({
                type: translate(typeKey, 'works.types'),
                typeKey: typeKey,
                averageDifference: totalDiff / diffCount,
                count: typeWorks.length
            });
        }
    });

    // Sortiert nach durchschnittlichem Unterschied (absteigend)
    return result.sort((a, b) => b.averageDifference - a.averageDifference);
};

/**
 * Findet die Kriterien mit den größten Unterschieden für jeden Typ
 * @param {Array} differencesByType - Unterschiede nach Typ und Kriterium
 * @param {Function} translate - Übersetzungsfunktion
 * @returns {Array} - Größte Unterschiede je Typ
 */
export const findLargestDifferencesByType = (differencesByType, translate) => {
    const resultByType = {};

    differencesByType.forEach(item => {
        if (!resultByType[item.type] || item.averageDifference > resultByType[item.type].averageDifference) {
            resultByType[item.type] = {
                criterion: item.criterion,
                averageDifference: item.averageDifference
            };
        }
    });

    return Object.entries(resultByType).map(([typeKey, data]) => ({
        type: translate(typeKey, 'works.types'),
        criterion: translate(data.criterion, 'works.criteriaLabels'),
        averageDifference: data.averageDifference
    }));
};

/**
 * Findet die Top-Kriterien mit den größten Unterschieden über alle Typen
 * @param {Array} differencesByType - Unterschiede nach Typ und Kriterium
 * @param {Function} translate - Übersetzungsfunktion
 * @param {number} limit - Anzahl der zurückzugebenden Kriterien (Standard: 5)
 * @returns {Array} - Top-Kriterien nach Unterschied
 */
export const findTopCriteriaByDifference = (differencesByType, translate, limit = 5) => {
    const topCriteria = differencesByType.map(item => ({
        criterion: translate(item.criterion, 'works.criteriaLabels'),
        type: translate(item.type, 'works.types'),
        averageDifference: item.averageDifference,
    }));

    return topCriteria
        .sort((a, b) => b.averageDifference - a.averageDifference)
        .slice(0, limit);
};