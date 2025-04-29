import React, { memo, useMemo } from 'react';
import { ScatterChart, Scatter, ZAxis, Cell } from 'recharts';
import BaseChartComponent from './BaseChartComponent';
import {CHART_MODE, DATA_KEYS} from "../../constants/chartConstants";
import {
    calculateCriteriaDeviationData,
    calculateCriteriaCorrelationData
} from '../../utils/statistics/criteriaAnalysisUtils';
import useChart from "../../hooks/useChart";
import { CHART_TYPES } from "../../constants/chartTypes";
import { renderScatterChartBase } from "../../utils/chartUtils";
import CriteriaDeviationTable from './criteriaAnalysis/CriteriaDeviationTable';
import CriteriaCorrelationGrid from './criteriaAnalysis/CriteriaCorrelationGrid';

const CriteriaAnalysisComponent = memo(({ work, chartType = CHART_TYPES.STATISTICS }) => {
    const {
        t,
        chartDimensions,
        chartColors,
        commonChartConfig,
        tooltipConfig,
        defaultLegendProps,
        scatterConfig
    } = useChart({
        chartType,
        mode: CHART_MODE.SCATTER
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
                            fill={chartColors.PRIMARY}
                        >
                            {criteriaData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.scoreDiff > 20 ? chartColors.TERTIARY : chartColors.SECONDARY}
                                />
                            ))}
                        </Scatter>
                    </ScatterChart>
                </BaseChartComponent>
            </div>

            <CriteriaDeviationTable
                criteriaData={criteriaData.slice(0, 5)}
                chartType={chartType}
            />

            <CriteriaCorrelationGrid
                correlationData={correlationData}
                chartType={chartType}
            />
        </div>
    );
});

export default CriteriaAnalysisComponent;