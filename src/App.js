import React from 'react';
import './App.css';
import Visualization from './components/visualization';
import DarkModeToggle from './components/common/DarkModeToggle';
import ErrorBoundary from './components/common/ErrorBoundary';
import { AppProvider } from './AppContext';

function App() {
    return (
        <ErrorBoundary showDetails={true}>
            <AppProvider>
                <div className="app-container">
                    <DarkModeToggle />
                    <Visualization/>
                </div>
            </AppProvider>
        </ErrorBoundary>
    );
}

export default App;