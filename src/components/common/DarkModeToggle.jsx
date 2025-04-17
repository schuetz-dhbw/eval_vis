import React, { useEffect, useState } from 'react';
import { toggleDarkMode } from '../../utils/darkmode';
import './styles/darkModeToggle.css';

const DarkModeToggle = () => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Synchronisiere den Toggle-Status mit dem tatsächlichen Modus
        setIsDark(document.documentElement.classList.contains('dark-mode'));

        // Event-Listener für System-Präferenzänderungen
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = (e) => {
            if (localStorage.getItem('darkMode') === null) {
                setIsDark(e.matches);
                document.documentElement.classList.toggle('dark-mode', e.matches);
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const handleToggle = () => {
        toggleDarkMode();
        setIsDark(!isDark);
    };

    return (
        <button
            className="dark-mode-toggle"
            onClick={handleToggle}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
            {isDark ? '☀️' : '🌙'}
        </button>
    );
};

export default DarkModeToggle;