import React, {useMemo} from 'react';
import BaseChartComponent from '../charts/BaseChartComponent';
import useChart from '../../hooks/useChart';
import { CHART_TYPES, ANALYSIS_TYPES } from '../../constants/chartConstants';
import { getDifferenceColor } from '../../utils/chartUtils';

const ParallelCoordinatePlotComponent = ({ data }) => {
    const {
        t,
        chartColors
    } = useChart({
        analysisType: ANALYSIS_TYPES.DASHBOARD,
        chartType: CHART_TYPES.PARALLEL
    });

    // Dimensionen
    const height = 600;
    const width = 800;
    const padding = { top: 40, right: 60, bottom: 40, left: 60 };

    // Min/Max-Werte berechnen - jetzt mit useMemo
    const minGrade = useMemo(() => Math.floor(
        Math.min(...data.map(d => Math.min(d.aiGrade, d.humanGrade)))
    ), [data]);

    const maxGrade = useMemo(() => Math.ceil(
        Math.max(...data.map(d => Math.max(d.aiGrade, d.humanGrade)))
    ), [data]);

    // Positionsberechnungen als Memoized Functions
    const xAI = padding.left;
    const xHuman = width - padding.right;

    // Memoize Scale Funktion
    const yScale = useMemo(() => {
        return (grade) => {
            return padding.top + (height - padding.top - padding.bottom) *
                (grade - minGrade) / (maxGrade - minGrade);
        };
    }, [padding.top, padding.bottom, height, minGrade, maxGrade]);

    // Memoize Tick-Berechnungen für die Achsen
    const axisTicks = useMemo(() => {
        return Array.from({ length: Math.round((maxGrade - minGrade) * 10) + 1 }, (_, i) => {
            const grade = minGrade + i / 10;
            const isFullGrade = Math.abs(Math.round(grade) - grade) < 0.05;
            const isFifthGrade = Math.abs(grade - Math.floor(grade) - 0.5) < 0.05;

            return {
                grade,
                isFullGrade,
                isFifthGrade,
                y: padding.top + (height - padding.top - padding.bottom) *
                    ((grade - minGrade) / (maxGrade - minGrade))
            };
        });
    }, [minGrade, maxGrade, padding.top, padding.bottom, height]);

    // Memoize Line Data für bessere Performance
    const lineData = useMemo(() => {
        return data.map(item => {
            const y1 = yScale(item.aiGrade);
            const y2 = yScale(item.humanGrade);
            const lineColor = getDifferenceColor(item.difference, chartColors, {high: 1, medium: 0.5});
            return {
                key: item.id || item.title,
                title: item.title,
                aiGrade: item.aiGrade,
                humanGrade: item.humanGrade,
                y1,
                y2,
                lineColor,
                tooltip: `${item.title}: AI ${item.aiGrade.toFixed(1)}, Human ${item.humanGrade.toFixed(1)}`
            };
        });
    }, [data, yScale, chartColors]);


    // Prepare table data sorted by title
    const tableData = useMemo(() => {
        return data
            .map(item => ({
                key: item.key,
                title: item.title,
                aiGrade: item.aiGrade,
                humanGrade: item.humanGrade,
                difference: item.difference,
                differenceColor: getDifferenceColor(item.difference, chartColors, {high: 1, medium: 0.5})
            }))
            .sort((a, b) => Math.abs(a.difference) - Math.abs(b.difference));
    }, [data, chartColors]);

    return (
        <div className="component-container">
        <BaseChartComponent height={height}>
            <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
                {/* Achsen zeichnen */}
                <line x1={xAI} y1={padding.top} x2={xAI} y2={height-padding.bottom}
                      stroke="currentColor" strokeWidth="1" />
                <line x1={xHuman} y1={padding.top} x2={xHuman} y2={height-padding.bottom}
                      stroke="currentColor" strokeWidth="1" />

                {/* Achsenbeschriftungen */}
                <text x={xAI} y={padding.top-15} textAnchor="middle" fill={chartColors.PRIMARY} fontSize="12">
                    {t('ai', 'labels')}
                </text>
                <text x={xHuman} y={padding.top-15} textAnchor="middle" fill={chartColors.SECONDARY} fontSize="12">
                    {t('human', 'labels')}
                </text>

                {/* Y-Achsen-Labels - jetzt aus memoized axisTicks */}
                {axisTicks.map((tick, idx) => (
                    <React.Fragment key={idx}>
                        {(tick.isFullGrade || tick.isFifthGrade) && (
                            <>
                                <text
                                    x={xAI-5}
                                    y={tick.y+3}
                                    textAnchor="end"
                                    fontSize={tick.isFullGrade ? 12 : 10}
                                    fill="currentColor"
                                >
                                    {tick.isFullGrade ? Math.round(tick.grade) : tick.grade.toFixed(1)}
                                </text>
                                <text
                                    x={xHuman+5}
                                    y={tick.y+3}
                                    textAnchor="start"
                                    fontSize={tick.isFullGrade ? 12 : 10}
                                    fill="currentColor"
                                >
                                    {tick.isFullGrade ? Math.round(tick.grade) : tick.grade.toFixed(1)}
                                </text>
                            </>
                        )}

                        <line
                            x1={xAI-3}
                            x2={xAI}
                            y1={tick.y}
                            y2={tick.y}
                            stroke="currentColor"
                            strokeWidth={tick.isFullGrade ? 1 : (tick.isFifthGrade ? 0.75 : 0.5)}
                        />
                        <line
                            x1={xHuman}
                            x2={xHuman+3}
                            y1={tick.y}
                            y2={tick.y}
                            stroke="currentColor"
                            strokeWidth={tick.isFullGrade ? 1 : (tick.isFifthGrade ? 0.75 : 0.5)}
                        />
                    </React.Fragment>
                ))}

                {/* Verbindungslinien zeichnen - jetzt aus memoized lineData */}
                {lineData.map((item) => (
                    <g key={item.key} className="parallel-line-group">
                        <line
                            x1={xAI} y1={item.y1}
                            x2={xHuman} y2={item.y2}
                            stroke={item.lineColor}
                            strokeWidth="1.5"
                            strokeOpacity="0.7"
                        />
                        <circle cx={xAI} cy={item.y1} r="3" fill={chartColors.PRIMARY} />
                        <circle cx={xHuman} cy={item.y2} r="3" fill={chartColors.SECONDARY} />

                        {/* Verbessertes Tooltip mit mehr Informationen */}
                        <title>{item.tooltip}</title>
                    </g>
                ))}

                {/* Legende */}
                <g transform={`translate(${width/2}, ${height-10})`}>
                    <text textAnchor="middle" fontSize="10" fill="currentColor">
                        {t('lineColorIndicatesDifference', 'dashboard')}
                    </text>
                </g>
            </svg>
        </BaseChartComponent>
            <div className="grade-comparison-table">
                <table className="data-table">
                    <thead>
                    <tr>
                        <th>{t('work', 'tableHeaders')}</th>
                        <th>{t('ai', 'labels')} {t('grade', 'labels')}</th>
                        <th>{t('human', 'labels')} {t('grade', 'labels')}</th>
                        <th>{t('difference', 'labels')}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tableData.map((item, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                            <td>{item.title}</td>
                            <td style={{ color: chartColors.PRIMARY }}>{item.aiGrade.toFixed(1)}</td>
                            <td style={{ color: chartColors.SECONDARY }}>{item.humanGrade.toFixed(1)}</td>
                            <td style={{ color: item.differenceColor }}>
                                {item.difference > 0 ? '+' : ''}{item.difference.toFixed(1)}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default React.memo(ParallelCoordinatePlotComponent);