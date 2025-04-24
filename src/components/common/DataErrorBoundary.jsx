import React, { useState, useEffect } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { useTranslation } from '../../hooks/useTranslation';
import './styles/dataErrorBoundary.css';

const DataErrorFallback = ({ error, resetErrorBoundary }) => {
    const t = useTranslation(); // Keine language-Übergabe mehr

    return (
        <div className="data-error-fallback">
            <h3 className="error-title">{t('dataErrorTitle', 'errors')}</h3>
            <p className="error-message">{t('dataErrorMessage', 'errors')}</p>
            <button className="error-button" onClick={resetErrorBoundary}>
                {t('tryAgain', 'errors')}
            </button>
        </div>
    );
};

const DataErrorBoundary = ({ children, data }) => {
    // language-Parameter entfernt
    const [hasError, setHasError] = useState(false);
    const t = useTranslation(); // Keine language-Übergabe mehr

    // Reset error state when data changes
    useEffect(() => {
        setHasError(false);
    }, [data]);

    // Check if data is valid before rendering
    if (!data || (Array.isArray(data) && data.length === 0)) {
        return (
            <div className="data-error-container">
                <h3 className="error-title">{t('dataErrorTitle', 'errors')}</h3>
                <p className="error-message">{t('dataErrorMessage', 'errors')}</p>
            </div>
        );
    }

    return (
        <ErrorBoundary
            fallbackTitle={t('dataErrorTitle', 'errors')}
            fallbackMessage={t('dataErrorMessage', 'errors')}
            showDetails={false}
        >
            {children}
        </ErrorBoundary>
    );
};

export default DataErrorBoundary;