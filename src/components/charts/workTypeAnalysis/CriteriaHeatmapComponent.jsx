// src/components/charts/workTypeAnalysis/CriteriaHeatmapComponent.jsx
import React, { memo } from 'react';
import { getChartColors } from '../../../constants/chartConfig';
import { useTranslation } from '../../../hooks/useTranslation';

const CriteriaHeatmapComponent = memo(({ data }) => {
    const t = useTranslation();
    const CHART_COLORS = getChartColors();

    return (
        <div className="flex-column">
            <p className="item-description">
                {t('criteriaHeatmapDescription', 'hints')}
                </p>
            <div className="legend-container">
                <div className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: CHART_COLORS.SECONDARY }}></span>
                    <span className="legend-text">&lt; 15%</span>
                </div>
                <div className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: CHART_COLORS.PRIMARY }}></span>
                    <span className="legend-text">15-30%</span>
                </div>
                <div className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: CHART_COLORS.TERTIARY }}></span>
                    <span className="legend-text">&gt; 30%</span>
                </div>
            </div>
            <div className="analysis-grid small-cells">
                {data.map((item, index) => {
                    let intensityClass = "low-intensity";
                    if (item.averageDifference > 30) {
                        intensityClass = "high-intensity";
                    } else if (item.averageDifference > 15) {
                        intensityClass = "medium-intensity";
                    }

                    return (
                        <div
                            key={index}
                            className={`color-cell ${intensityClass}`}
                            style={{
                                opacity: 0.7 + (item.averageDifference / 100 * 0.3)
                            }}
                            title={`${item.type} - ${item.criterion}: ${item.averageDifference.toFixed(1)}%`}
                        >
                            {item.averageDifference.toFixed(0)}%
                        </div>
                    );
                })}
            </div>
        </div>
    );
});

export default CriteriaHeatmapComponent;