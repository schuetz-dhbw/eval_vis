import React, { memo, useMemo } from 'react';
import { ScatterChart, Scatter, ZAxis, Cell } from 'recharts';
import BaseChartComponent from './BaseChartComponent';
import {CHART_TYPES, ANALYSIS_TYPES, DATA_KEYS} from "../../constants/chartConstants";
import {
    calculateCriteriaDeviationData,
    calculateCriteriaCorrelationData
} from '../../utils/statistics/criteriaAnalysisUtils';
import useChart from "../../hooks/useChart";
import {getDifferenceColor, renderScatterChartBase} from "../../utils/chartUtils";
import CriteriaDeviationComponent from './criteriaAnalysis/CriteriaDeviationComponent';
import CriteriaCorrelationComponent from './criteriaAnalysis/CriteriaCorrelationComponent';

const CriteriaAnalysisComponent = memo(({ work, analysisType = ANALYSIS_TYPES.STATISTICS }) => {
    const {
        t,
        chartDimensions,
        chartColors,
        commonChartConfig,
        tooltipConfig,
        defaultLegendProps,
        scatterConfig
    } = useChart({
        analysisType,
        chartType: CHART_TYPES.SCATTER
    });

    // Berechnungsfunktionen
    const criteriaData = useMemo(() => {
        return calculateCriteriaDeviationData(work);
    }, [work]);

    const correlationData = useMemo(() => {
        return calculateCriteriaCorrelationData(work);
    }, [work]);

    return (
        <div className="flex-column">
            <div className="component-container">
                <h3 className="section-title">{t('deviationTitle', 'chartTitles')}</h3>
                <BaseChartComponent height={chartDimensions.height}>
                    <ScatterChart margin={commonChartConfig.margin}>
                        {renderScatterChartBase(t,
                            { xDataKey: DATA_KEYS.AI_SCORE, yDataKey: DATA_KEYS.HUMAN_SCORE },
                            tooltipConfig,
                            defaultLegendProps
                        )}
                        <ZAxis
                            type="number"
                            dataKey="deviation"
                            range={scatterConfig.zRange}
                            name={t('deviation', 'labels')}
                        />
                        <Scatter
                            name={t('criteriaDeviations', 'labels')}
                            data={criteriaData}
                            fill={chartColors.QUINARY}
                        >
                            {criteriaData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={getDifferenceColor(entry.scoreDiff, chartColors)}
                                />
                            ))}
                        </Scatter>
                    </ScatterChart>
                </BaseChartComponent>
            </div>

            <CriteriaDeviationComponent
                criteriaData={criteriaData.slice(0, 5)}
                analysisType={analysisType}
            />

            <CriteriaCorrelationComponent
                correlationData={correlationData}
                analysisType={analysisType}
            />
        </div>
    );
});

export default CriteriaAnalysisComponent;