import React, {useMemo} from 'react';
import { getSimilarityColor} from '../../utils/chartUtils';
import useChart from '../../hooks/useChart';
import { CHART_TYPES, ANALYSIS_TYPES } from '../../constants/chartConstants';
import {calculateSimilarityData} from "../../utils/dataTransformers/dashboardUtils";

const SimilarityTableComponent = ({ works }) => {
    const {
        t,
        chartColors
    } = useChart({
        analysisType: ANALYSIS_TYPES.DASHBOARD,
        chartType: CHART_TYPES.BAR
    });

    const similarityData = useMemo(() => {
        return calculateSimilarityData(works);
    }, [works]);

    return (
        <div className="table-container">
            <table className="data-table">
                <thead>
                <tr>
                    <th>{t('work', 'dashboard')}</th>
                    <th>{t('similarity', 'dashboard')}</th>
                    <th>{t('category', 'dashboard')}</th>
                    <th>{t('visualization', 'dashboard')}</th>
                </tr>
                </thead>
                <tbody>
                {similarityData.map((item, index) => {
                    const backgroundColor = getSimilarityColor(item.similarity * 100, chartColors, {high: 95, medium: 90});

                    return (
                        <tr key={item.key} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                            <td>{item.title}</td>
                            <td>{item.similarity.toFixed(3)}</td>
                            <td>{t(item.category + 'Similarity', 'dashboard')}</td>
                            <td>
                                <div
                                    className="similarity-indicator"
                                    style={{
                                        backgroundColor,
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        textAlign: 'center',
                                        width: `${item.similarity * 100}%`,
                                        minWidth: '40px',
                                    }}
                                >
                                    {(item.similarity * 100).toFixed(1)}%
                                </div>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
};

export default SimilarityTableComponent;