import React, { memo } from 'react';
import { ResponsiveContainer } from 'recharts';
import ChartErrorBoundary from './ChartErrorBoundary';

/**
 * BaseChartComponent - Eine Basiskomponente für alle Chart-Typen
 *
 * @param {ReactNode} children - Der eigentliche Chart-Inhalt
 * @param {number} height - Höhe des Charts
 * @param {string} width - Breite des Charts
 * @param {string} className - Optionale CSS-Klasse für den Container
 * @param {string} title - Optionaler Titel für den Chart
 * @returns {JSX.Element} ResponsiveContainer mit Error Handling
 */
const BaseChartComponent = memo(({
                                     children,
                                     height,
                                     width = '100%',
                                     className = '',
                                     title = null
                                 }) => {
    return (
        <ChartErrorBoundary>
            {title && <h4 className="chart-title">{title}</h4>}
            <div className={`chart-wrapper ${className}`}>
                <ResponsiveContainer width={width} height={height}>
                    {children}
                </ResponsiveContainer>
            </div>
        </ChartErrorBoundary>
    );
});

export default BaseChartComponent;