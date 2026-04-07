import { useEffect } from 'react';
import { useUIStore } from '@/stores/uiStore';

export const useTheme = () => {
  const { theme, setTheme } = useUIStore();

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (themeValue) => {
      if (themeValue === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.toggle('dark', prefersDark);
      } else {
        root.classList.toggle('dark', themeValue === 'dark');
      }
    };

    applyTheme(theme);

    // Listen for system theme changes when in system mode
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = (e) => {
        root.classList.toggle('dark', e.matches);
      };

      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, [theme]);

  return { theme, setTheme };
};