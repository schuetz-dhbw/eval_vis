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

const WorkTypeAnalysisComponent = memo(({ works, chartType }) => {
    const {
        t,
        CHART_COLORS,
    } = useChart({ chartType });

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

    // Tooltip-Formatter für Charts
    const tooltipFormatter = useMemo(() => {
        return (data) => {
            return {
                title: data.type,
                items: [
                    {
                        name: t('avgDifference', 'metrics'),
                        value: data.averageDifference.toFixed(2) + "%",
                        className: ""
                    },
                    {
                        name: t('count', 'tableHeaders'),
                        value: data.count,
                        className: ""
                    }
                ]
            };
        };
    }, [t]);

    // Bestimme Farbe basierend auf Unterschiedswert
    const getDifferenceColor = useMemo(() => {
        return (value) => {
            if (value > 30) return CHART_COLORS.TERTIARY; // Großer Unterschied - orange
            if (value > 15) return CHART_COLORS.PRIMARY;  // Mittlerer Unterschied - lila
            return CHART_COLORS.SECONDARY;                // Kleiner Unterschied - grün
        };
    }, [CHART_COLORS.PRIMARY, CHART_COLORS.SECONDARY, CHART_COLORS.TERTIARY]);

    return (
        <div className="work-type-analysis">
            <div className="flex-column">
                <div className="component-container">
                    <h4 className="section-title">{t('differenceByTypeTitle', 'chartTitles')}</h4>
                    <TypeDifferenceChartComponent
                        data={overallDifferenceByType}
                        getDifferenceColor={getDifferenceColor}
                        tooltipFormatter={tooltipFormatter}
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