import ErrorBoundary from './ErrorBoundary';
import { useTranslation } from '../../hooks/useTranslation';

const DataErrorBoundary = ({ children, data }) => {
    const t = useTranslation();

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