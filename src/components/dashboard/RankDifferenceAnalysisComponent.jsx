import React from 'react';
import useChart from '../../hooks/useChart';
import { CHART_TYPES, ANALYSIS_TYPES } from '../../constants/chartConstants';
import { getDifferenceColor } from '../../utils/chartUtils';

const RankDifferenceAnalysisComponent = ({ data }) => {
    const {
        t,
        chartColors,
    } = useChart({
        analysisType: ANALYSIS_TYPES.DASHBOARD,
        chartType: CHART_TYPES.RANK_DIFFERENCE
    });

    // Maximum Differenz für die Skalierung
    const maxDiff = Math.max(...data.topDifferenceItems.map(item => item.absDiff));

    return (
        <div className="component-container">
            <h4 className="subtitle">{t('rankDifferences', 'dashboard')}</h4>

            <div className="rank-difference-chart">
                <div className="legend-container">
                    <div className="legend-item">
                        <span className="legend-color" style={{ backgroundColor: chartColors.OPTIMAL }}></span>
                        <span>{t('smallDifference', 'dashboard')}</span>
                    </div>
                    <div className="legend-item">
                        <span className="legend-color" style={{ backgroundColor: chartColors.MODERATE }}></span>
                        <span>{t('mediumDifference', 'dashboard')}</span>
                    </div>
                    <div className="legend-item">
                        <span className="legend-color" style={{ backgroundColor: chartColors.CRITICAL }}></span>
                        <span>{t('largeDifference', 'dashboard')}</span>
                    </div>
                </div>

                <table className="data-table rank-difference-table">
                    <thead>
                    <tr>
                        <th>{t('work', 'tableHeaders')}</th>
                        <th>{t('aiRank', 'dashboard')}</th>
                        <th>{t('humanRank', 'dashboard')}</th>
                        <th>{t('difference', 'labels')}</th>
                        <th>{t('visualization', 'dashboard')}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.topDifferenceItems.map((item, index) => {
                        const barColor = getDifferenceColor(item.absDiff * 5, chartColors);
                        const barWidth = (item.absDiff / maxDiff) * 100;
                        const barDirection = item.rankDiff > 0 ? 'right' : 'left';

                        return (
                            <tr key={index} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                                <td>{item.title}</td>
                                <td>{item.aiRank}</td>
                                <td>{item.humanRank}</td>
                                <td>{item.rankDiff > 0 ? '+' : ''}{item.rankDiff}</td>
                                <td>
                                    <div className="difference-bar-container">
                                        <div
                                            className={`difference-bar difference-${barDirection}`}
                                            style={{
                                                width: `${barWidth}%`,
                                                backgroundColor: barColor
                                            }}
                                        ></div>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RankDifferenceAnalysisComponent;