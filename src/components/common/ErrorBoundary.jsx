import React, { Component } from 'react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError() {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Catch errors in any components below and re-render with error message
        this.setState({
            error: error,
            errorInfo: errorInfo
        });

        // You can also log error messages to an error reporting service here
        console.error("Error caught by ErrorBoundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // Fallback UI when error occurs
            return (
                <div className="error-container">
                    <h3 className="error-title">{this.props.fallbackTitle || "An error occurred."}</h3>
                    <p className="error-message">{this.props.fallbackMessage || "An error occurred while rendering this component."}</p>
                    {this.props.showDetails && this.state.error && (
                        <details className="error-details">
                            <summary>Technical Details</summary>
                            <p>{this.state.error.toString()}</p>
                            <pre>{this.state.errorInfo?.componentStack}</pre>
                        </details>
                    )}
                </div>
            );
        }

        // Normally, just render children
        return this.props.children;
    }
}

export default ErrorBoundary;