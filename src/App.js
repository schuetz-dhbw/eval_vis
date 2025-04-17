import React from 'react';
import './App.css';
import Visualization from './components/visualization';
import DarkModeToggle from './components/common/DarkModeToggle';
import ErrorBoundary from './components/common/ErrorBoundary';

function App() {
    return (
        <ErrorBoundary showDetails={true}>
            <div className="app-container">
                <DarkModeToggle />
                <Visualization/>
            </div>
        </ErrorBoundary>
    );
}

export default App;