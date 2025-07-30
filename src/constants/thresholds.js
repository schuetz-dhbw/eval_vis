import { QUALITY_THRESHOLDS } from './metrics';

export const SIMILARITY_THRESHOLDS = QUALITY_THRESHOLDS.COSINE;
export const DISTANCE_THRESHOLDS = QUALITY_THRESHOLDS.DISTANCE;
export const GRADE_DIFFERENCE_THRESHOLDS = QUALITY_THRESHOLDS.GRADE_DIFFERENCE;

// New normalized distance thresholds (0-1 scale)
export const NORMALIZED_DISTANCE_THRESHOLDS = {
    EXCELLENT: 0.15,   // < 15% of theoretical maximum disagreement
    GOOD: 0.25,        // < 25% of theoretical maximum disagreement
    MODERATE: 0.35     // < 35% of theoretical maximum disagreement
};