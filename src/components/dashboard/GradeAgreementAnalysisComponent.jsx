import React, { useMemo } from 'react';
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Cell } from 'recharts';
import BaseChartComponent from '../charts/BaseChartComponent';
import useChart from '../../hooks/useChart';
import { CHART_TYPES, ANALYSIS_TYPES } from '../../constants/chartConstants';

const GradeAgreementAnalysisComponent = ({ works, translatedWorks }) => { // ADD translatedWorks prop
    const {
        t,
        chartDimensions,
        chartColors,
        commonChartConfig,
        formatValue
    } = useChart({
        analysisType: ANALYSIS_TYPES.DASHBOARD,
        chartType: CHART_TYPES.BAR
    });

    // Calculate agreement categories
    const agreementData = useMemo(() => {
        if (!works || works.length === 0) return [];

        // Create title lookup map
        const titleMap = new Map();
        if (translatedWorks && translatedWorks.length) {
            translatedWorks.forEach(work => {
                titleMap.set(work.key, work.title);
            });
        }

        let strongAgreement = 0;
        let moderateAgreement = 0;
        let substantialDisagreement = 0;

        const agreementDetails = works.map(work => {
            const gradeDiff = Math.abs(work.aiGrade - work.humanGrade);
            let category, color;

            if (gradeDiff < 0.5) {
                category = 'strong';
                color = chartColors.OPTIMAL;
                strongAgreement++;
            } else if (gradeDiff <= 1.0) {
                category = 'moderate';
                color = chartColors.MODERATE;
                moderateAgreement++;
            } else {
                category = 'substantial';
                color = chartColors.CRITICAL;
                substantialDisagreement++;
            }

            return {
                title: titleMap.get(work.key) || work.title || work.key, // FIX: Use translated title
                aiGrade: work.aiGrade,
                humanGrade: work.humanGrade,
                difference: gradeDiff,
                category,
                color
            };
        });

        const total = works.length;
        const chartData = [
            {
                category: t('strongAgreement', 'dashboard'),
                count: strongAgreement,
                percentage: (strongAgreement / total) * 100,
                description: '<0.5'
            },
            {
                category: t('moderateAgreement', 'dashboard'),
                count: moderateAgreement,
                percentage: (moderateAgreement / total) * 100,
                description: '0.5-1.0'
            },
            {
                category: t('substantialDisagreement', 'dashboard'),
                count: substantialDisagreement,
                percentage: (substantialDisagreement / total) * 100,
                description: '>1.0'
            }
        ];

        return {
            chartData,
            agreementDetails: agreementDetails.sort((a, b) => b.difference - a.difference),
            summary: {
                strongAgreement,
                moderateAgreement,
                substantialDisagreement,
                total
            }
        };
    }, [works, translatedWorks, chartColors, t]); // ADD translatedWorks to dependencies

    if (!agreementData.chartData.length) {
        return <div className="no-data-message">{t('noDataAvailable', 'errors')}</div>;
    }

    // Colors for bars
    const barColors = [chartColors.OPTIMAL, chartColors.MODERATE, chartColors.CRITICAL];

    return (
        <div className="component-container">
            <h4 className="subtitle">{t('gradeAgreementAnalysis', 'dashboard')}</h4>

            {/* Summary Statistics */}
            <div className="component-grid grid-3-cols" style={{ marginBottom: 'var(--space-lg)' }}>
                <div className="info-box">
                    <div className="data-value" style={{ color: chartColors.OPTIMAL }}>
                        {agreementData.summary.strongAgreement}
                    </div>
                    <div className="data-label">{t('strongAgreement', 'dashboard')}</div>
                    <div className="item-description">
                        {formatValue(agreementData.chartData[0].percentage)}% <br/> ({t('gradeDiff', 'dashboard')} {'<0.5'})
                    </div>
                </div>
                <div className="info-box">
                    <div className="data-value" style={{ color: chartColors.MODERATE }}>
                        {agreementData.summary.moderateAgreement}
                    </div>
                    <div className="data-label">{t('moderateAgreement', 'dashboard')}</div>
                    <div className="item-description">
                        {formatValue(agreementData.chartData[1].percentage)}% <br/> ({t('gradeDiff', 'dashboard')} 0.5-1.0)
                    </div>
                </div>
                <div className="info-box">
                    <div className="data-value" style={{ color: chartColors.CRITICAL }}>
                        {agreementData.summary.substantialDisagreement}
                    </div>
                    <div className="data-label">{t('substantialDisagreement', 'dashboard')}</div>
                    <div className="item-description">
                        {formatValue(agreementData.chartData[2].percentage)}% <br/> ({t('gradeDiff', 'dashboard')} >1.0)
                    </div>
                </div>
            </div>

            {/* Bar Chart */}
            <BaseChartComponent height={chartDimensions.height}>
                <BarChart
                    data={agreementData.chartData}
                    margin={commonChartConfig.margin}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="category"
                        tick={{ fontSize: 10 }}
                        interval={0}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                    />
                    <YAxis />
                    <Tooltip
                        formatter={(value, name, props) => {
                            // Get the actual percentage from the data entry
                            const actualPercentage = props.payload.percentage;
                            return [
                                `${actualPercentage.toFixed(1)}%`,
                                t('percentage', 'dashboard')
                            ];
                        }}
                    />
                    <Bar dataKey="count" name={t('count', 'tableHeaders')}>
                        {agreementData.chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={barColors[index]} />
                        ))}
                    </Bar>
                </BarChart>
            </BaseChartComponent>

            {/* Detailed Table */}
            <h5 className="subtitle" style={{ marginTop: 'var(--space-lg)' }}>
                {t('detailedAgreementAnalysis', 'dashboard')}
            </h5>
            <div className="table-container">
                <table className="data-table">
                    <thead>
                    <tr>
                        <th>{t('work', 'tableHeaders')}</th>
                        <th>{t('aiGrade', 'tableHeaders')}</th>
                        <th>{t('humanGrade', 'tableHeaders')}</th>
                        <th>{t('difference', 'labels')}</th>
                        <th>{t('agreementLevel', 'dashboard')}</th>
                        <th>{t('visualization', 'dashboard')}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {agreementData.agreementDetails.map((item, index) => {
                        // FIX: Get correct translation for agreement level
                        let agreementText;
                        if (item.category === 'strong') {
                            agreementText = t('strongAgreement', 'dashboard');
                        } else if (item.category === 'moderate') {
                            agreementText = t('moderateAgreement', 'dashboard');
                        } else {
                            agreementText = t('substantialDisagreement', 'dashboard');
                        }

                        return (
                            <tr key={index} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                                <td style={{ maxWidth: '200px' }}>{item.title}</td>
                                <td style={{ color: chartColors.PRIMARY, fontWeight: 'bold' }}>
                                    {item.aiGrade.toFixed(1)}
                                </td>
                                <td style={{ color: chartColors.SECONDARY, fontWeight: 'bold' }}>
                                    {item.humanGrade.toFixed(1)}
                                </td>
                                <td style={{ color: item.color, fontWeight: 'bold' }}>
                                    {item.difference.toFixed(2)}
                                </td>
                                <td>
                                    <span style={{ color: item.color, fontWeight: 'bold' }}>
                                        {agreementText}
                                    </span>
                                </td>
                                <td>
                                    <div className="difference-bar-container">
                                        <div
                                            className="difference-bar"
                                            style={{
                                                width: `${Math.min((item.difference / 2) * 100, 100)}%`,
                                                backgroundColor: item.color
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

export default React.memo(GradeAgreementAnalysisComponent);