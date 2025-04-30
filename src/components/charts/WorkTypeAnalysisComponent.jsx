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
import {CHART_TYPES, ANALYSIS_TYPES} from "../../constants/chartConstants";

const WorkTypeAnalysisComponent = memo(({ works, analysisType = ANALYSIS_TYPES.WORK_TYPE_ANALYSIS }) => {
    const { t } = useChart({
        analysisType,
        chartType: CHART_TYPES.BAR
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
                        analysisType={analysisType}
                    />
                </div>

                <div className="component-container">
                    <h4 className="section-title">{t('criteriaByTypeTitle', 'chartTitles')}</h4>
                    <CriteriaHeatmapComponent
                        data={differencesByType}
                        analysisType={analysisType}
                    />
                </div>

                <div className="component-container">
                    <h4 className="section-title">{t('workTypeTableTitle', 'chartTitles')}</h4>
                    <AnalysisTablesComponent
                        largestDifferencesByType={largestDifferencesByType}
                        topCriteriaByDifference={topCriteriaByDifference}
                        analysisType={analysisType}
                    />
                </div>
            </div>
        </div>
    );
});

export default WorkTypeAnalysisComponent;