import React, { memo } from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import { getIntensityClass } from '../../../utils/chartUtils';
import {CHART_TYPES} from "../../../constants/chartTypes";

const CriteriaCorrelationGrid = memo(({
                                          correlationData,
                                          chartType = CHART_TYPES.STATISTICS
                                      }) => {
    const t = useTranslation();

    return (
        <div className="component-container">
            <h3 className="section-title">{t('correlationTitle', 'chartTitles')}</h3>
            <div className="analysis-grid big-cells">
                {correlationData
                    .sort((a, b) => Math.abs(parseFloat(b.correlation)) - Math.abs(parseFloat(a.correlation)))
                    .slice(0, 10)
                    .map((item, index) => {
                        // Klassen und Anzeige basierend auf Korrelationsstärke
                        const corrValue = parseFloat(item.correlation);
                        const intensityClass = getIntensityClass(corrValue, { high: 0.7, medium: 0.3 });

                        return (
                            <div
                                key={index}
                                className={`analysis-cell ${intensityClass}`}
                                title={`${item.name1} - ${item.name2}: ${item.correlation}`}
                            >
                                <div className="cell-value">
                                    {corrValue > 0 ? "+" : ""}{item.correlation}
                                </div>
                                <div className="flex-column flex-center">
                                    <div>{item.name1}</div>
                                    <div>&amp;</div>
                                    <div>{item.name2}</div>
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
});

export default CriteriaCorrelationGrid;