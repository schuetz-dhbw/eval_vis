import React, { memo } from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import {CHART_TYPES} from "../../../constants/chartTypes";

const AnalysisTablesComponent = memo(({
                                          largestDifferencesByType,
                                          topCriteriaByDifference,
                                          chartType = CHART_TYPES.WORK_TYPE_ANALYSIS
                                      }) => {
    const t = useTranslation();

    return (
        <div className="split-layout">
            <div className="flex-column">
                <h4 className="subtitle">{t('largestDiffByTypeTitle', 'chartTitles')}</h4>
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>{t('workType', 'tableHeaders') || "Work Type"}</th>
                            <th>{t('criterion', 'tableHeaders')}</th>
                            <th>{t('avgDifference', 'metrics') || "Avg. Difference"}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {largestDifferencesByType.map((item, index) => (
                            <tr key={index}>
                                <td>{item.type}</td>
                                <td>{item.criterion}</td>
                                <td>{item.averageDifference.toFixed(2)}%</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="flex-column">
                <h4 className="subtitle">{t('topCriteriaTitle', 'chartTitles')}</h4>
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>{t('criterion', 'tableHeaders')}</th>
                            <th>{t('avgDifference', 'metrics') || "Avg. Difference"}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {topCriteriaByDifference.map((item, index) => (
                            <tr key={index}>
                                <td>{item.criterion}</td>
                                <td>{item.averageDifference.toFixed(2)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
});

export default AnalysisTablesComponent;