import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

export const useTheme = (storageKey = 'jarvis-theme') => {
  // Get initial theme from localStorage or system preference
  const getInitialTheme = (): Theme => {
    // Check if window is defined (for SSR)
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem(storageKey) as Theme | null;
      
      // If a theme is stored, use it
      if (storedTheme) {
        return storedTheme;
      }
      
      // Otherwise, check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    }
    
    // Default to light if window is not defined
    return 'light';
  };

  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  // Function to set theme and persist it
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(storageKey, newTheme);
  };

  // Toggle theme function
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Effect to apply theme to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Effect to listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if the user hasn't explicitly set a preference
      if (!localStorage.getItem(storageKey)) {
        setThemeState(e.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [storageKey]);

  return { theme, setTheme, toggleTheme };
};

export default useTheme;
