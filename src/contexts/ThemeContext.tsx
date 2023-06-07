// ThemeContext.tsx
import React, {createContext, useContext, useEffect, useState} from 'react';
import {Theme, darkTheme, lightTheme} from '../styles/styles';

interface ThemeContextType {
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  currentTheme: Theme;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export interface ProviderProps {
  children: React.ReactNode;
}

const ThemeProvider: React.FC<ProviderProps> = ({children}: ProviderProps) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const currentTheme = isDarkMode ? darkTheme : lightTheme;

  useEffect(() => {
    const checkTimeAndSetTheme = () => {
      const hours = new Date().getHours();
      const newIsDarkMode = hours >= 21 || hours < 6;
      setIsDarkMode(newIsDarkMode || true); // TODO: Remove || true
    };

    checkTimeAndSetTheme();
    const interval = setInterval(checkTimeAndSetTheme, 60000); // Check every minute

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <ThemeContext.Provider value={{isDarkMode, setIsDarkMode, currentTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};

export {ThemeProvider, ThemeContext, useTheme};
