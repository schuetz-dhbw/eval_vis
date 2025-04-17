import React from 'react';
import ErrorBoundary from '../common/ErrorBoundary';
import { useTranslation } from '../../hooks/useTranslation';
import './styles/chartErrorBoundary.css';

const ChartErrorBoundary = ({ children, language, chartType }) => {
    const t = useTranslation(language);

    return (
        <ErrorBoundary
            fallbackTitle={t('chartErrorTitle', 'errors') || "Visualisierungsfehler"}
            fallbackMessage={t('chartErrorMessage', 'errors') || "Die Visualisierung konnte nicht geladen werden."}
            showDetails={false}
        >
            <div className="chart-error-boundary">
                {children}
            </div>
        </ErrorBoundary>
    );
};

export default ChartErrorBoundary;