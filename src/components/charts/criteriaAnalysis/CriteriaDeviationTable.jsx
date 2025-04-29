import React, { memo } from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import {CHART_TYPES} from "../../../constants/chartTypes";

const CriteriaDeviationTable = memo(({
                                         criteriaData,
                                         chartType = CHART_TYPES.STATISTICS
                                     }) => {
    const t = useTranslation();

    return (
        <div className="component-container">
            <h3 className="section-title">{t('deviationTable', 'chartTitles')}</h3>
            <div className="table-container">
                <table className="data-table">
                    <thead>
                    <tr>
                        <th>{t('criterion', 'tableHeaders')}</th>
                        <th>{t('ai', 'labels')}</th>
                        <th>{t('human', 'labels')}</th>
                        <th>{t('difference', 'labels') || "Difference"}</th>
                        <th>{t('deviation', 'labels') || "Deviation"}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {criteriaData.map((item, index) => (
                        <tr key={index} className={index % 2 === 0 ? "even-row" : "odd-row"}>
                            <td>{item.name}</td>
                            <td>{item.aiScore}%</td>
                            <td>{item.humanScore}%</td>
                            <td>{item.scoreDiff}%</td>
                            <td>{item.deviation.toFixed(2)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
});

export default CriteriaDeviationTable;