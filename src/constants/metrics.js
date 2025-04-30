// Globale Metriken und Qualitätsschwellenwerte

export const METRICS = {
    FULL_MARK: 100,               // Maximaler Scorewert
    WEIGHT_SCALE: 100,            // Skalierungsfaktor für Gewichtungen
    DATA_MAX: 20,               // Maximaler Gewichtungswert
    DEFAULT_DECIMAL_PLACES: 2     // Standardanzahl der Dezimalstellen
};

// Qualitätsschwellenwerte für verschiedene Metriken
export const QUALITY_THRESHOLDS = {
    COSINE: {                    // Kosinus-Ähnlichkeit (höher = besser)
        EXCELLENT: 0.9,
        GOOD: 0.7,
        MODERATE: 0.5
    },
    DISTANCE: {                  // Euklidische Distanz (niedriger = besser)
        EXCELLENT: 50,
        GOOD: 100,
        MODERATE: 150
    },
    GRADE_DIFFERENCE: {          // Notendifferenz (niedriger = besser)
        EXCELLENT: 0.4,
        GOOD: 0.6,
        MODERATE: 1.1
    }
};