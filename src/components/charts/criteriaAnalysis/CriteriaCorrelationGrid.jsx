import React from 'react';
import {getDifferenceColor} from "../../../utils/chartUtils";
import {CHART_TYPES} from "../../../constants/chartConstants";
import useChart from "../../../hooks/useChart";

const CriteriaCorrelationGrid = ({ correlationData, analysisType }) => {
    const {
        t,
        chartColors
    } = useChart({
        analysisType,
        chartType: CHART_TYPES.SCATTER
    });

    return (
        <div className="component-container">
            <h3 className="section-title">{t('correlationTitle', 'chartTitles')}</h3>
            <div className="analysis-grid big-cells">
                {correlationData
                    .sort((a, b) => Math.abs(parseFloat(b.correlation)) - Math.abs(parseFloat(a.correlation)))
                    .slice(0, 10)
                    .map((item, index) => {
                        // Korrelationswert parsen
                        const corrValue = parseFloat(item.correlation);

                        // Hintergrundfarbe mit getDifferenceColor bestimmen
                        const backgroundColor = getDifferenceColor(Math.abs(corrValue) * 100, chartColors);

                        return (
                            <div
                                key={index}
                                className="analysis-cell"
                                style={{
                                    backgroundColor: backgroundColor
                                }}
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
};

export default CriteriaCorrelationGrid;