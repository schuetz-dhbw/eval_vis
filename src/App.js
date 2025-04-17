import React from 'react';
import './App.css';
import Visualization from './components/visualization';
import DarkModeToggle from './components/common/DarkModeToggle';

function App() {
    return (
        <div className="app-container">
            <DarkModeToggle />
            <Visualization/>
        </div>
    );
}

export default App;