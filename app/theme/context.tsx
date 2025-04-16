import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { light } from './light';
import { dark } from './dark';
import { useColorScheme } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'system';
type ThemeContextType = {
  mode: ThemeMode;
  theme: typeof light;
  setMode: (_: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>({ mode: 'dark', theme: light, setMode: () => { } });

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    AsyncStorage.getItem('theme').then(saved => {
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        setModeState(saved);
      }
    });
  }, []);

  const setMode = (mode: ThemeMode) => {
    setModeState(mode);
    AsyncStorage.setItem('theme', mode);
  };

  const colorScheme = useColorScheme();
  const activeTheme = mode === 'system' ? (colorScheme === 'dark' ? dark : light) : mode === 'dark' ? dark : light;

  return (
    <ThemeContext.Provider value={{ mode, theme: activeTheme, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeContext must be used inside ThemeProvider');
  return ctx;
};
