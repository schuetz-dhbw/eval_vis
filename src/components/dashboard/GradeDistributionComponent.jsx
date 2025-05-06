import React from 'react';
import BaseChartComponent from '../charts/BaseChartComponent';
import useChart from '../../hooks/useChart';
import { CHART_TYPES } from '../../constants/chartConstants';
import {formatNumber} from "../../utils/dataUtils";
import {METRICS} from "../../constants/metrics";

const GradeDistributionComponent = ({ data, analysisType }) => {
    const {
        t,
        chartDimensions,
        formatValue
    } = useChart({
        analysisType,
        chartType: CHART_TYPES.BOXPLOT
    });

    return (
        <BaseChartComponent height={chartDimensions.DEFAULT_HEIGHT}>

                {/* Box-Plot-Tabelle */}
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th></th>
                            <th>{t('min', 'dashboard')}</th>
                            <th>{t('q1', 'dashboard')}</th>
                            <th>{t('median', 'dashboard')}</th>
                            <th>{t('q3', 'dashboard')}</th>
                            <th>{t('max', 'dashboard')}</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr className="ai">
                            <td>{t('ai', 'labels')}</td>
                            <td>{formatValue(data[0].min)}</td>
                            <td>{formatValue(data[0].q1)}</td>
                            <td>{formatValue(data[0].median)}</td>
                            <td>{formatValue(data[0].q3)}</td>
                            <td>{formatValue(data[0].max)}</td>
                        </tr>
                        <tr className="human">
                            <td>{t('human', 'labels')}</td>
                            <td>{formatValue(data[1].min)}</td>
                            <td>{formatValue(data[1].q1)}</td>
                            <td>{formatValue(data[1].median)}</td>
                            <td>{formatValue(data[1].q3)}</td>
                            <td>{formatValue(data[1].max)}</td>
                        </tr>
                        <tr className="totals-row">
                            <td>{t('difference', 'dashboard')}</td>
                            <td>{formatValue(Math.abs(data[0].min - data[1].min))}</td>
                            <td>{formatValue(Math.abs(data[0].q1 - data[1].q1))}</td>
                            <td>{formatValue(Math.abs(data[0].median - data[1].median))}</td>
                            <td>{formatValue(Math.abs(data[0].q3 - data[1].q3))}</td>
                            <td>{formatValue(Math.abs(data[0].max - data[1].max))}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

        </BaseChartComponent>
    );
};

export default GradeDistributionComponent;