import React, { useMemo } from 'react';
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Cell } from 'recharts';
import BaseChartComponent from '../charts/BaseChartComponent';
import useChart from '../../hooks/useChart';
import { CHART_TYPES, ANALYSIS_TYPES } from '../../constants/chartConstants';
import { calculateSimilarityMetrics } from '../../utils/dataTransformers';
import {QUALITY_THRESHOLDS} from "../../constants/metrics";

const SimilarityAgreementDistributionComponent = ({ works, translatedWorks }) => {
    const {
        t,
        chartDimensions,
        chartColors,
        commonChartConfig,
        formatValue
    } = useChart({
        analysisType: ANALYSIS_TYPES.DASHBOARD,
        chartType: CHART_TYPES.BAR
    });

    // Calculate similarity distributions
    const similarityData = useMemo(() => {
        if (!works || works.length === 0) return [];

        // Create title lookup map
        const titleMap = new Map();
        if (translatedWorks && translatedWorks.length) {
            translatedWorks.forEach(work => {
                titleMap.set(work.key, work.title);
            });
        }

        let cosineHigh = 0, cosineMedium = 0, cosineLow = 0;
        let euclideanHigh = 0, euclideanMedium = 0, euclideanLow = 0;

        const workDetails = works.map(work => {
            const metrics = calculateSimilarityMetrics(work);
            const cosine = metrics.similarity;
            const normalizedDistance = metrics.normalizedDistance;

// Cosine similarity categories
            let cosineCategory;
            if (cosine > QUALITY_THRESHOLDS.COSINE.EXCELLENT) {
                cosineCategory = 'high';
                cosineHigh++;
            } else if (cosine >= QUALITY_THRESHOLDS.COSINE.GOOD) {
                cosineCategory = 'medium';
                cosineMedium++;
            } else {
                cosineCategory = 'low';
                cosineLow++;
            }

// Normalized Euclidean distance categories
            let euclideanCategory;
            if (normalizedDistance < QUALITY_THRESHOLDS.DISTANCE.EXCELLENT) {
                euclideanCategory = 'high';
                euclideanHigh++;
            } else if (normalizedDistance <= QUALITY_THRESHOLDS.DISTANCE.GOOD) {
                euclideanCategory = 'medium';
                euclideanMedium++;
            } else {
                euclideanCategory = 'low';
                euclideanLow++;
            }

            return {
                title: titleMap.get(work.key) || work.title || work.key,
                cosine: cosine,
                normalizedDistance: normalizedDistance,
                cosineCategory,
                euclideanCategory
            };
        });

        const total = works.length;

        // Create chart data for both metrics
        const cosineData = [
            {
                category: t('highSimilarity', 'dashboard'),
                metric: 'cosine',
                count: cosineHigh,
                percentage: (cosineHigh / total) * 100,
                description: `>${QUALITY_THRESHOLDS.COSINE.EXCELLENT}`
            },
            {
                category: t('mediumSimilarity', 'dashboard'),
                metric: 'cosine',
                count: cosineMedium,
                percentage: (cosineMedium / total) * 100,
                description: `${QUALITY_THRESHOLDS.COSINE.GOOD}-${QUALITY_THRESHOLDS.COSINE.EXCELLENT}`
            },
            {
                category: t('lowSimilarity', 'dashboard'),
                metric: 'cosine',
                count: cosineLow,
                percentage: (cosineLow / total) * 100,
                description: `<${QUALITY_THRESHOLDS.COSINE.GOOD}`
            }
        ];

        const euclideanData = [
            {
                category: t('highAgreement', 'dashboard') || 'High Agreement',
                metric: 'euclidean',
                count: euclideanHigh,
                percentage: (euclideanHigh / total) * 100,
                description: `<${QUALITY_THRESHOLDS.DISTANCE.EXCELLENT}`
            },
            {
                category: t('mediumAgreement', 'dashboard') || 'Medium Agreement',
                metric: 'euclidean',
                count: euclideanMedium,
                percentage: (euclideanMedium / total) * 100,
                description: `${QUALITY_THRESHOLDS.DISTANCE.EXCELLENT}-${QUALITY_THRESHOLDS.DISTANCE.GOOD}`
            },
            {
                category: t('lowAgreement', 'dashboard') || 'Low Agreement',
                metric: 'euclidean',
                count: euclideanLow,
                percentage: (euclideanLow / total) * 100,
                description: `>${QUALITY_THRESHOLDS.DISTANCE.GOOD}`
            }
        ];


        return {
            cosineData,
            euclideanData,
            workDetails,
            summary: {
                cosine: { high: cosineHigh, medium: cosineMedium, low: cosineLow },
                euclidean: { high: euclideanHigh, medium: euclideanMedium, low: euclideanLow },
                total
            }
        };
    }, [works, translatedWorks, t]);

    if (!similarityData.cosineData.length) {
        return <div className="no-data-message">{t('noDataAvailable', 'errors')}</div>;
    }

    const barColors = [chartColors.OPTIMAL, chartColors.MODERATE, chartColors.CRITICAL];

    return (
        <div className="component-container">
            <h4 className="subtitle">{t('similarityAgreementDistribution', 'dashboard') || 'Similarity Agreement Distribution'}</h4>

            {/* Summary Statistics */}
            <div className="component-grid grid-2-cols" style={{ marginBottom: 'var(--space-lg)' }}>
                <div className="info-box">
                    <div className="data-label">{t('cosineSimilarity', 'dashboard')}</div>
                    <div className="component-grid grid-3-cols">
                        <div>
                            <div className="data-value" style={{ color: chartColors.OPTIMAL, fontSize: 'var(--font-size-base)' }}>
                                {similarityData.summary.cosine.high}
                            </div>
                            <div className="data-label" style={{ fontSize: 'var(--font-size-xs)' }}>{t('highSimilarity', 'dashboard')}</div>
                            <div className="item-description">
                                {formatValue((similarityData.summary.cosine.high / similarityData.summary.total) * 100)}%  <br/> ({t('cosineSimilarity', 'dashboard')} >{QUALITY_THRESHOLDS.COSINE.EXCELLENT})
                            </div>
                        </div>
                        <div>
                            <div className="data-value" style={{ color: chartColors.MODERATE, fontSize: 'var(--font-size-base)' }}>
                                {similarityData.summary.cosine.medium}
                            </div>
                            <div className="data-label" style={{ fontSize: 'var(--font-size-xs)' }}>{t('mediumSimilarity', 'dashboard')}</div>
                            <div className="item-description">
                                {formatValue((similarityData.summary.cosine.medium / similarityData.summary.total) * 100)}%  <br/> ({t('cosineSimilarity', 'dashboard')} {QUALITY_THRESHOLDS.COSINE.GOOD}-{QUALITY_THRESHOLDS.COSINE.EXCELLENT})
                            </div>
                        </div>
                        <div>
                            <div className="data-value" style={{ color: chartColors.CRITICAL, fontSize: 'var(--font-size-base)' }}>
                                {similarityData.summary.cosine.low}
                            </div>
                            <div className="data-label" style={{ fontSize: 'var(--font-size-xs)' }}>{t('lowSimilarity', 'dashboard')}</div>
                            <div className="item-description">
                                {formatValue((similarityData.summary.cosine.low / similarityData.summary.total) * 100)}%  <br/> ({t('cosineSimilarity', 'dashboard')} {'<'}{QUALITY_THRESHOLDS.COSINE.GOOD})
                            </div>
                        </div>
                    </div>
                </div>
                <div className="info-box">
                    <div className="data-label">{t('normalizedDistance', 'metrics')}</div>
                    <div className="component-grid grid-3-cols">
                        <div>
                            <div className="data-value" style={{ color: chartColors.OPTIMAL, fontSize: 'var(--font-size-base)' }}>
                                {similarityData.summary.euclidean.high}
                            </div>
                            <div className="data-label" style={{ fontSize: 'var(--font-size-xs)' }}>{t('highAgreement', 'dashboard')}</div>
                            <div className="item-description">
                                {formatValue((similarityData.summary.euclidean.high / similarityData.summary.total) * 100)}%  <br/> ({t('distance', 'metrics')} {'< ' + QUALITY_THRESHOLDS.DISTANCE.EXCELLENT})
                            </div>
                        </div>
                        <div>
                            <div className="data-value" style={{ color: chartColors.MODERATE, fontSize: 'var(--font-size-base)' }}>
                                {similarityData.summary.euclidean.medium}
                            </div>
                            <div className="data-label" style={{ fontSize: 'var(--font-size-xs)' }}>{t('mediumAgreement', 'dashboard')}</div>
                            <div className="item-description">
                                {formatValue((similarityData.summary.euclidean.medium / similarityData.summary.total) * 100)}% <br/> ({t('distance', 'metrics')} {QUALITY_THRESHOLDS.DISTANCE.EXCELLENT}-{QUALITY_THRESHOLDS.DISTANCE.GOOD})
                            </div>
                        </div>
                        <div>
                            <div className="data-value" style={{ color: chartColors.CRITICAL, fontSize: 'var(--font-size-base)' }}>
                                {similarityData.summary.euclidean.low}
                            </div>
                            <div className="data-label" style={{ fontSize: 'var(--font-size-xs)' }}>{t('lowAgreement', 'dashboard')}</div>
                            <div className="item-description">
                                {formatValue((similarityData.summary.euclidean.low / similarityData.summary.total) * 100)}% <br/> ({t('distance', 'metrics')} {'> ' + QUALITY_THRESHOLDS.DISTANCE.GOOD})
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Side-by-side Bar Charts */}
            <div className="component-grid grid-2-cols">
                {/* Cosine Similarity Chart */}
                <div>
                    <h5 className="subtitle">{t('cosineSimilarity', 'dashboard')} {t('distribution', 'dashboard') || 'Distribution'}</h5>
                    <BaseChartComponent height={chartDimensions.height}>
                        <BarChart data={similarityData.cosineData} margin={commonChartConfig.margin}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="category" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                            <YAxis />
                            <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, t('percentage', 'dashboard')]} />
                            <Bar dataKey="percentage" name={t('percentage', 'dashboard')}>
                                {similarityData.cosineData.map((entry, index) => (
                                    <Cell key={`cosine-${index}`} fill={barColors[index]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </BaseChartComponent>
                </div>

                {/* Euclidean Distance Chart */}
                <div>
                    <h5 className="subtitle">{t('normalizedDistance', 'metrics')} {t('distribution', 'dashboard') || 'Distribution'}</h5>
                    <BaseChartComponent height={chartDimensions.height}>
                        <BarChart data={similarityData.euclideanData} margin={commonChartConfig.margin}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="category" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                            <YAxis />
                            <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, t('percentage', 'dashboard')]} />
                            <Bar dataKey="percentage" name={t('percentage', 'dashboard')}>
                                {similarityData.euclideanData.map((entry, index) => (
                                    <Cell key={`euclidean-${index}`} fill={barColors[index]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </BaseChartComponent>
                </div>
            </div>
        </div>
    );
};

export default React.memo(SimilarityAgreementDistributionComponent);