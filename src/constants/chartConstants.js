// Chart-spezifische Konstanten

// Enum für Chart-Modi (Visualisierungstypen)
export const CHART_TYPES = {
    BAR: 'bar',
    LINE: 'line',
    RADAR: 'radar',
    PIE: 'pie',
    SCATTER: 'scatter',
    HEATMAP: 'heatmap',
    COMBINED: 'combined',
    BOXPLOT: 'boxplot',
    VIOLIN: 'violin',
    PARALLEL: 'parallel',
    RANK_CORRELATION: 'rankCorrelation',
    RANK_DIFFERENCE: 'rankDifference'
};

// Daten-Keys für die Charts
export const DATA_KEYS = {
    AI: 'ai',
    HUMAN: 'human',
    AI_SCORE: 'aiScore',
    HUMAN_SCORE: 'humanScore',
    AI_WEIGHT: 'aiWeight',
    HUMAN_WEIGHT: 'humanWeight',
    AI_WEIGHTED: 'aiWeighted',
    HUMAN_WEIGHTED: 'humanWeighted',
    NAME: 'name',
    SHORT_NAME: 'shortName',
    FULL_MARK: 'fullMark',
    DIFF: 'diff',
    COUNT: 'count',
    RANK_DIFF: 'rankDiff',
    AI_RANK: 'aiRank',
    HUMAN_RANK: 'humanRank',
    DENSITY: 'density'
};

// Cache-Keys
export const CACHE_KEYS = {
    SCORES: 'scores',
    WEIGHTS: 'weights',
    WEIGHTED: 'weighted',
    COMBINED: 'combined',
    RADAR: 'radar-TODELETE'
};

// Analysearten für die Darstellung
export const ANALYSIS_TYPES = Object.freeze({
    DASHBOARD: 'dashboard',
    SCORES: 'scores',
    WEIGHTS: 'weights',
    COMBINED: 'combined',
    STATISTICS: 'statistics'
});

export const DEFAULT_ANALYSIS_TYPE = ANALYSIS_TYPES.DASHBOARD;