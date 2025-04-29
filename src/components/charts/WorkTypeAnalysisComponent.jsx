import React, { memo, useMemo } from 'react';
import {
    groupWorksByType,
    calculateDifferencesByType,
    calculateOverallDifferenceByType,
    findLargestDifferencesByType,
    findTopCriteriaByDifference
} from '../../utils/statistics/workTypeAnalysisUtils';
import { getDifferenceColor } from '../../utils/chartUtils';
import TypeDifferenceChartComponent from './workTypeAnalysis/TypeDifferenceChartComponent';
import CriteriaHeatmapComponent from './workTypeAnalysis/CriteriaHeatmapComponent';
import AnalysisTablesComponent from './workTypeAnalysis/AnalysisTablesComponent';
import useChart from "../../hooks/useChart";
import { CHART_DIMENSIONS } from '../../constants/chartConfig';

const WorkTypeAnalysisComponent = memo(({ works }) => {
    const {
        t,
    } = useChart({ chartType: 'workTypeAnalysis' });

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
                        height={CHART_DIMENSIONS.WORK_TYPE_HEIGHT}
                    />
                </div>

                <div className="component-container">
                    <h4 className="section-title">{t('criteriaByTypeTitle', 'chartTitles')}</h4>
                    <CriteriaHeatmapComponent
                        data={differencesByType}
                        getDifferenceColor={getDifferenceColor}
                    />
                </div>

                <div className="component-container">
                    <h4 className="section-title">{t('workTypeTableTitle', 'chartTitles')}</h4>
                    <AnalysisTablesComponent
                        largestDifferencesByType={largestDifferencesByType}
                        topCriteriaByDifference={topCriteriaByDifference}
                    />
                </div>
            </div>
        </div>
    );
});

export default WorkTypeAnalysisComponent;