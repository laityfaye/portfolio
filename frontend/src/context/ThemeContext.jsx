import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const themes = {
  cyan: {
    name: 'Cyan',
    primary: {
      light: '#22d3ee',
      main: '#06b6d4',
      dark: '#0891b2',
    },
    gradient: 'from-cyan-300 via-blue-400 to-purple-500',
    gradientDark: 'from-cyan-500 via-blue-600 to-purple-600',
    glow: 'rgba(6, 182, 212, 0.4)',
    shadow: 'rgba(6, 182, 212, 0.2)',
  },
  purple: {
    name: 'Purple',
    primary: {
      light: '#c084fc',
      main: '#a855f7',
      dark: '#9333ea',
    },
    gradient: 'from-purple-300 via-pink-400 to-red-500',
    gradientDark: 'from-purple-500 via-pink-600 to-red-600',
    glow: 'rgba(168, 85, 247, 0.4)',
    shadow: 'rgba(168, 85, 247, 0.2)',
  },
  green: {
    name: 'Green',
    primary: {
      light: '#4ade80',
      main: '#22c55e',
      dark: '#16a34a',
    },
    gradient: 'from-green-300 via-emerald-400 to-teal-500',
    gradientDark: 'from-green-500 via-emerald-600 to-teal-600',
    glow: 'rgba(34, 197, 94, 0.4)',
    shadow: 'rgba(34, 197, 94, 0.2)',
  },
  orange: {
    name: 'Orange',
    primary: {
      light: '#fb923c',
      main: '#f97316',
      dark: '#ea580c',
    },
    gradient: 'from-orange-300 via-red-400 to-pink-500',
    gradientDark: 'from-orange-500 via-red-600 to-pink-600',
    glow: 'rgba(249, 115, 22, 0.4)',
    shadow: 'rgba(249, 115, 22, 0.2)',
  },
  pink: {
    name: 'Pink',
    primary: {
      light: '#f9a8d4',
      main: '#ec4899',
      dark: '#db2777',
    },
    gradient: 'from-pink-300 via-rose-400 to-red-500',
    gradientDark: 'from-pink-500 via-rose-600 to-red-600',
    glow: 'rgba(236, 72, 153, 0.4)',
    shadow: 'rgba(236, 72, 153, 0.2)',
  },
  blue: {
    name: 'Blue',
    primary: {
      light: '#60a5fa',
      main: '#3b82f6',
      dark: '#2563eb',
    },
    gradient: 'from-blue-300 via-indigo-400 to-purple-500',
    gradientDark: 'from-blue-500 via-indigo-600 to-purple-600',
    glow: 'rgba(59, 130, 246, 0.4)',
    shadow: 'rgba(59, 130, 246, 0.2)',
  },
  red: {
    name: 'Red',
    primary: {
      light: '#f87171',
      main: '#ef4444',
      dark: '#dc2626',
    },
    gradient: 'from-red-300 via-rose-400 to-orange-500',
    gradientDark: 'from-red-500 via-rose-600 to-orange-600',
    glow: 'rgba(239, 68, 68, 0.4)',
    shadow: 'rgba(239, 68, 68, 0.2)',
  },
  yellow: {
    name: 'Yellow',
    primary: {
      light: '#fde047',
      main: '#eab308',
      dark: '#ca8a04',
    },
    gradient: 'from-yellow-300 via-amber-400 to-orange-500',
    gradientDark: 'from-yellow-500 via-amber-600 to-orange-600',
    glow: 'rgba(234, 179, 8, 0.4)',
    shadow: 'rgba(234, 179, 8, 0.2)',
  },
  indigo: {
    name: 'Indigo',
    primary: {
      light: '#a5b4fc',
      main: '#6366f1',
      dark: '#4f46e5',
    },
    gradient: 'from-indigo-300 via-violet-400 to-purple-500',
    gradientDark: 'from-indigo-500 via-violet-600 to-purple-600',
    glow: 'rgba(99, 102, 241, 0.4)',
    shadow: 'rgba(99, 102, 241, 0.2)',
  },
  teal: {
    name: 'Teal',
    primary: {
      light: '#5eead4',
      main: '#14b8a6',
      dark: '#0d9488',
    },
    gradient: 'from-teal-300 via-cyan-400 to-blue-500',
    gradientDark: 'from-teal-500 via-cyan-600 to-blue-600',
    glow: 'rgba(20, 184, 166, 0.4)',
    shadow: 'rgba(20, 184, 166, 0.2)',
  },
  amber: {
    name: 'Amber',
    primary: {
      light: '#fcd34d',
      main: '#f59e0b',
      dark: '#d97706',
    },
    gradient: 'from-amber-300 via-yellow-400 to-orange-500',
    gradientDark: 'from-amber-500 via-yellow-600 to-orange-600',
    glow: 'rgba(245, 158, 11, 0.4)',
    shadow: 'rgba(245, 158, 11, 0.2)',
  },
  rose: {
    name: 'Rose',
    primary: {
      light: '#fda4af',
      main: '#f43f5e',
      dark: '#e11d48',
    },
    gradient: 'from-rose-300 via-pink-400 to-fuchsia-500',
    gradientDark: 'from-rose-500 via-pink-600 to-fuchsia-600',
    glow: 'rgba(244, 63, 94, 0.4)',
    shadow: 'rgba(244, 63, 94, 0.2)',
  },
  emerald: {
    name: 'Emerald',
    primary: {
      light: '#6ee7b7',
      main: '#10b981',
      dark: '#059669',
    },
    gradient: 'from-emerald-300 via-green-400 to-teal-500',
    gradientDark: 'from-emerald-500 via-green-600 to-teal-600',
    glow: 'rgba(16, 185, 129, 0.4)',
    shadow: 'rgba(16, 185, 129, 0.2)',
  },
};

export const ThemeProvider = ({ children, initialTheme, initialMode, disableLocalStorage = false }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    if (initialTheme) return initialTheme;
    if (disableLocalStorage) return 'cyan';
    const savedTheme = localStorage.getItem('portfolio-theme');
    return savedTheme || 'cyan';
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof initialMode === 'boolean') return initialMode;
    if (disableLocalStorage) return true; // Default to dark for public portfolios
    const savedMode = localStorage.getItem('portfolio-mode');
    return savedMode !== 'light';
  });

  useEffect(() => {
    // Ne pas sauvegarder dans localStorage pour les portfolios publics
    if (!disableLocalStorage) {
      localStorage.setItem('portfolio-theme', currentTheme);
      localStorage.setItem('portfolio-mode', isDarkMode ? 'dark' : 'light');
    }

    // Update CSS variables
    const theme = themes[currentTheme];
    document.documentElement.style.setProperty('--theme-glow', theme.glow);
    document.documentElement.style.setProperty('--theme-shadow', theme.shadow);

    // Add/remove dark class on html element
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [currentTheme, isDarkMode, disableLocalStorage]);

  const changeTheme = (themeName) => {
    setCurrentTheme(themeName);
  };

  const toggleMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const setMode = (mode) => {
    setIsDarkMode(mode === 'dark');
  };

  return (
    <ThemeContext.Provider value={{
      currentTheme,
      changeTheme,
      theme: themes[currentTheme],
      isDarkMode,
      toggleMode,
      setMode
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
