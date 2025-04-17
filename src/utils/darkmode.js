export const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark-mode');

    // Speichere die Präferenz im localStorage
    const isDarkMode = document.documentElement.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
};

export const initDarkMode = () => {
    // Prüfe auf gespeicherte User-Präferenz
    const savedDarkMode = localStorage.getItem('darkMode');

    // Prüfe auf Systempräferenz falls keine Nutzerpräferenz gespeichert ist
    const prefersDarkMode = window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedDarkMode === 'enabled' || (savedDarkMode === null && prefersDarkMode)) {
        document.documentElement.classList.add('dark-mode');
    }
};