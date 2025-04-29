import React, { memo, useMemo } from 'react';
import {
    groupWorksByType,
    calculateDifferencesByType,
    calculateOverallDifferenceByType,
    findLargestDifferencesByType,
    findTopCriteriaByDifference
} from '../../utils/statistics/workTypeAnalysisUtils';
import TypeDifferenceChartComponent from './workTypeAnalysis/TypeDifferenceChartComponent';
import CriteriaHeatmapComponent from './workTypeAnalysis/CriteriaHeatmapComponent';
import AnalysisTablesComponent from './workTypeAnalysis/AnalysisTablesComponent';
import useChart from "../../hooks/useChart";
import {CHART_TYPES} from "../../constants/chartTypes";
import {CHART_MODE} from "../../constants/chartConstants";

const WorkTypeAnalysisComponent = memo(({ works, chartType = CHART_TYPES.WORK_TYPE_ANALYSIS }) => {
    const { t } = useChart({
        chartType,
        mode: CHART_MODE.WORK_TYPE
    });

    // Gruppiere Arbeiten nach Typ
    const groupedWorks = useMemo(() => {
        return groupWorksByType(works);
    }, [works]);

    // Berechne Unterschiede nach Kriterien für jeden Typ
    const differencesByType = useMemo(() => {
        return calculateDifferencesByType(groupedWorks);
    }, [groupedWorks]);

    // Berechne Gesamtunterschied nach Arbeitstyp
    const overallDifferenceByType = useMemo(() => {
        return calculateOverallDifferenceByType(groupedWorks, t);
    }, [groupedWorks, t]);

    // Finde Kriterien mit größtem Unterschied für jeden Typ
    const largestDifferencesByType = useMemo(() => {
        return findLargestDifferencesByType(differencesByType, t);
    }, [differencesByType, t]);

    // Finde Top-5-Kriterien mit größtem Unterschied
    const topCriteriaByDifference = useMemo(() => {
        return findTopCriteriaByDifference(differencesByType, t);
    }, [differencesByType, t]);

    return (
        <div className="work-type-analysis">
            <div className="flex-column">
                <div className="component-container">
                    <h4 className="section-title">{t('differenceByTypeTitle', 'chartTitles')}</h4>
                    <TypeDifferenceChartComponent
                        data={overallDifferenceByType}
                        chartType={chartType}
                    />
                </div>

                <div className="component-container">
                    <h4 className="section-title">{t('criteriaByTypeTitle', 'chartTitles')}</h4>
                    <CriteriaHeatmapComponent
                        data={differencesByType}
                        chartType={chartType}
                    />
                </div>

                <div className="component-container">
                    <h4 className="section-title">{t('workTypeTableTitle', 'chartTitles')}</h4>
                    <AnalysisTablesComponent
                        largestDifferencesByType={largestDifferencesByType}
                        topCriteriaByDifference={topCriteriaByDifference}
                        chartType={chartType}
                    />
                </div>
            </div>
        </div>
    );
});

export default WorkTypeAnalysisComponent;