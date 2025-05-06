import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/variables.css';  // Globale Variablen zuerst importieren
import './styles/global.css';     // Globale Styles danach
import './styles/components.css'; // Komponentenspezifische Styles
import './styles/dashboard.css'; // Dashboard Styles
import './styles/dark-theme.css';  // Dark Mode spezifische Styles
import './styles/media-queries.css'; // Media Queries zum Schluss
import { initDarkMode } from './utils/darkmode';
import App from './App';
import reportWebVitals from './reportWebVitals';

initDarkMode();

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
