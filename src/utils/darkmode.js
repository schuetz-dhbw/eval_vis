// In src/utils/darkmode.js
export const toggleDarkMode = () => {
    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'light' : 'dark');

    // Speichere die Präferenz im localStorage
    localStorage.setItem('theme', isDarkMode ? 'light' : 'dark');
};

export const initDarkMode = () => {
    // Prüfe auf gespeicherte User-Präferenz
    const savedTheme = localStorage.getItem('theme');

    // Prüfe auf Systempräferenz falls keine Nutzerpräferenz gespeichert ist
    const prefersDarkMode = window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (savedTheme === null && prefersDarkMode)) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }
};