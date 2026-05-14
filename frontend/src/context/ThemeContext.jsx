import {
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';


const ThemeContext = createContext();

const getSystemTheme = () => {
    if (typeof window === 'undefined') {
        return 'light';
    }

    return window.matchMedia(
        '(prefers-color-scheme: dark)'
    ).matches
        ? 'dark'
        : 'light';
};

export const ThemeProvider = ({ children }) => {

    const [theme, setTheme] = useState(
        () => localStorage.getItem('theme') || 'system'
    );

    const [systemTheme, setSystemTheme] = useState(
        getSystemTheme
    );

    const resolvedTheme =
        theme === 'system' ? systemTheme : theme;

    useEffect(() => {
        const mediaQuery = window.matchMedia(
            '(prefers-color-scheme: dark)'
        );

        const handleChange = (event) => {
            setSystemTheme(event.matches ? 'dark' : 'light');
        };

        mediaQuery.addEventListener?.('change', handleChange);
        mediaQuery.addListener?.(handleChange);

        return () => {
            mediaQuery.removeEventListener?.('change', handleChange);
            mediaQuery.removeListener?.(handleChange);
        };
    }, []);

    useEffect(() => {
        const root = window.document.documentElement;

        root.classList.remove('light', 'dark');
        root.classList.add(resolvedTheme);
        root.dataset.theme = theme;

        localStorage.setItem('theme', theme);
    }, [resolvedTheme, theme]);

    return (
        <ThemeContext.Provider
            value={{ theme, resolvedTheme, setTheme }}
        >
            {children}
        </ThemeContext.Provider>
    );
};


export const useTheme = () => {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error(
            'useTheme must be used within a ThemeProvider'
        );
    }

    return context;
};