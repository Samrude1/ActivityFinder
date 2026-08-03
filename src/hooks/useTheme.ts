import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

export function useTheme() {
    const [theme, setTheme] = useState<Theme>(() => {
        // Force light mode as default — ignore OS preference and saved dark theme
        const saved = localStorage.getItem('theme');
        if (saved === 'dark') {
            // Override any saved dark preference to light
            localStorage.setItem('theme', 'light');
            return 'light';
        }
        return 'light';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return { theme, toggleTheme };
}
