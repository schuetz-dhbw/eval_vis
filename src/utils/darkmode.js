export const toggleDarkMode = () => {
    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
    const newMode = isDarkMode ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newMode);
    localStorage.setItem('theme', newMode);

    return !isDarkMode; // Rückgabe für Context
};

export const initDarkMode = () => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDarkMode = window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDarkMode = savedTheme === 'dark' || (savedTheme === null && prefersDarkMode);

    document.documentElement.setAttribute('data-theme', shouldUseDarkMode ? 'dark' : 'light');
    return shouldUseDarkMode;
};