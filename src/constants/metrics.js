// Globale Metriken und Qualitätsschwellenwerte

export const METRICS = {
    FULL_MARK: 100,               // Maximaler Scorewert
    WEIGHT_SCALE: 100,            // Skalierungsfaktor für Gewichtungen
    DATA_MAX: 20,               // Maximaler Gewichtungswert
    DEFAULT_DECIMAL_PLACES: 2     // Standardanzahl der Dezimalstellen
};

// Qualitätsschwellenwerte für verschiedene Metriken
export const QUALITY_THRESHOLDS = {
    COSINE: {                    // Cosine similarity (higher = better)
        EXCELLENT: 0.9,
        GOOD: 0.8,
        MODERATE: 0.5
    },
    DISTANCE: {                  // Normalized Euclidean distance (lower = better)
        EXCELLENT: 0.3,
        GOOD: 0.45,
        MODERATE: 0.6
    },
    // Keep existing grade difference thresholds
    GRADE_DIFFERENCE: {
        EXCELLENT: 0.4,
        GOOD: 0.6,
        MODERATE: 1.1
    }
};