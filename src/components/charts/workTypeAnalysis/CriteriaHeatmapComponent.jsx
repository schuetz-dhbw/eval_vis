import React, { memo, useMemo } from 'react';
import { getDifferenceColor } from '../../../utils/chartUtils';
import useChart from "../../../hooks/useChart";
import {CHART_TYPES} from "../../../constants/chartTypes";

const CriteriaHeatmapComponent = memo(({ data }) => {
    const {
        t,
        chartColors
    } = useChart({
        chartType: CHART_TYPES.WORK_TYPE_ANALYSIS
    });

    // Gruppieren der Daten nach Typ für bessere Struktur
    const groupedData = useMemo(() => {
        const grouped = {};
        data.forEach(item => {
            if (!grouped[item.type]) {
                grouped[item.type] = [];
            }
            grouped[item.type].push(item);
        });
        return grouped;
    }, [data]);

    return (
        <div className="flex-column">
            <p className="item-description">
                {t('criteriaHeatmapDescription', 'hints')}
            </p>

            <div className="legend-container">
                <div className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: chartColors.SECONDARY }}></span>
                    <span className="legend-text">&lt; 15%</span>
                </div>
                <div className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: chartColors.PRIMARY }}></span>
                    <span className="legend-text">15-30%</span>
                </div>
                <div className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: chartColors.TERTIARY }}></span>
                    <span className="legend-text">&gt; 30%</span>
                </div>
            </div>

            {/* Für jeden Arbeitstyp einen eigenen Abschnitt erstellen */}
            {Object.entries(groupedData).map(([type, items]) => (
                <div key={type} className="heatmap-section">
                    <h5 className="heatmap-type-title">{t(type, 'works.types')}</h5>
                    <div className="analysis-grid medium-cells">
                        {items.map((item, index) => {
                            const criterionLabel = t(item.criterion, 'works.criteriaLabels');
                            return (
                                <div
                                    key={index}
                                    className={`analysis-cell`}
                                    style={{
                                        backgroundColor: getDifferenceColor(item.averageDifference, chartColors),
                                        opacity: 0.7 + (item.averageDifference / 100 * 0.3)
                                    }}
                                    title={`${t(type, 'works.types')} - ${criterionLabel}: ${item.averageDifference.toFixed(1)}%`}
                                >
                                    <div className="cell-criterion">{criterionLabel}</div>
                                    <div className="cell-value">{item.averageDifference.toFixed(0)}%</div>
                                    <div className="cell-count">n={item.count}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
});

export default CriteriaHeatmapComponent;