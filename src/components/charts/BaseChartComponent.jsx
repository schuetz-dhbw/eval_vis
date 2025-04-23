import React from 'react';
import { ResponsiveContainer } from 'recharts';
import { CHART_DIMENSIONS } from '../../constants/chartConfig';
import ChartErrorBoundary from './ChartErrorBoundary';
import './styles/charts.css';

/**
 * BaseChartComponent - Eine Basiskomponente für alle Chart-Typen
 *
 * @param {ReactNode} children - Der eigentliche Chart-Inhalt
 * @param {number} height - Höhe des Charts
 * @param {string} width - Breite des Charts
 * @param {string} language - Aktuelle Sprache für Übersetzungen und Fehlermeldungen
 * @param {Object} className - Optionale CSS-Klasse für den Container
 * @returns {JSX.Element} ResponsiveContainer mit Error Handling
 */
const BaseChartComponent = ({
                                children,
                                height = CHART_DIMENSIONS.DEFAULT_HEIGHT,
                                width = CHART_DIMENSIONS.FULL_WIDTH,
                                language,
                                className = ''
                            }) => {
    return (
        <ChartErrorBoundary language={language}>
            <div className={`chart-wrapper ${className}`}>
                <ResponsiveContainer width={width} height={height}>
                    {children}
                </ResponsiveContainer>
            </div>
        </ChartErrorBoundary>
    );
};

export default BaseChartComponent;