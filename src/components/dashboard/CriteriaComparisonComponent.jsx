import React from 'react';
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import BaseChartComponent from '../charts/BaseChartComponent';
import CustomTooltip from '../charts/CustomTooltip';
import {getDifferenceColor, renderDashboardCriteriaBars} from '../../utils/chartUtils';
import useChart from "../../hooks/useChart";
import {CHART_TYPES} from "../../constants/chartConstants";

const CriteriaComparisonComponent = ({ data, analysisType }) => {
    const {
        t,
        chartDimensions,
        chartColors,
        commonChartConfig,
        defaultLegendProps,
        formatValue
    } = useChart({
        analysisType,
        chartType: CHART_TYPES.BAR
    });

    // Transformiere und übersetze die Daten für die Charts mit dem useTranslation Hook
    const chartData = data.map(item => ({
        name: t(item.key, 'works.criteriaLabels'),
        key: item.key,
        ai: item.ai,
        human: item.human,
        diff: item.diff,
        count: item.count
    }));

    // Sortiere nach Differenz (größte zuerst)
    const sortedData = [...chartData].sort((a, b) => b.diff - a.diff);

    return (
        <div className="component-container">
        <BaseChartComponent height={chartDimensions.height * 4}>
            <BarChart
                data={chartData}
                margin={commonChartConfig.margin}
                layout="vertical"
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend {...defaultLegendProps}/>
                {renderDashboardCriteriaBars(t, chartColors, chartData)}
            </BarChart>
        </BaseChartComponent>


        <h4 className="subtitle">{t('criteriaComparison', 'dashboard')}</h4>

        <table className="data-table criteria-comparison-table">
            <thead>
            <tr>
                <th>{t('criterion', 'tableHeaders')}</th>
                <th>{t('aiAverage', 'tableHeaders')}</th>
                <th>{t('humanAverage', 'tableHeaders')}</th>
                <th>{t('difference', 'tableHeaders')}</th>
                <th>{t('evaluations', 'tableHeaders')}</th>
                <th>{t('visualization', 'dashboard')}</th>
            </tr>
            </thead>
            <tbody>
            {sortedData.map((item, index) => {
                const diffColor = getDifferenceColor(item.diff, chartColors, { high: 25, medium: 15 });
                const maxDiff = Math.max(...sortedData.map(d => d.diff));
                const barWidth = (item.diff / maxDiff) * 100;

                return (
                    <tr key={item.key} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                        <td className="criterion-name">{item.name}</td>
                        <td className="score-cell">
                                    <span className="score-value ai-score">
                                        {formatValue(item.ai)}%
                                    </span>
                        </td>
                        <td className="score-cell">
                                    <span className="score-value human-score">
                                        {formatValue(item.human)}%
                                    </span>
                        </td>
                        <td className="score-cell">
                                    <span
                                        className="score-value difference-value"
                                        style={{ color: diffColor }}
                                    >
                                        {formatValue(item.diff)}%
                                    </span>
                        </td>
                        <td className="count-cell">{item.count}</td>
                        <td className="visualization-cell">
                            <div className="difference-bar-container">
                                <div
                                    className="difference-bar"
                                    style={{
                                        width: `${barWidth}%`,
                                        backgroundColor: diffColor
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

    );
};

export default CriteriaComparisonComponent;