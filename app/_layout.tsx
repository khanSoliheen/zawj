import { Slot } from 'expo-router';
import { useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { ITheme } from '@/constants/types';

import { ToastProvider } from './hooks/toaster';
import { DataProvider, useData } from './hooks/useData';
import { AuthProvider } from './hooks/userContext';
import { ThemeProvider } from './hooks/useTheme';

const AppContainer = () => {
  const { theme, setTheme } = useData();

  const handleThemeChange = useCallback(
    (nextTheme?: ITheme) => {
      if (nextTheme) {
        setTheme(nextTheme);
      }
    },
    [setTheme],
  );

  return (
    <ThemeProvider theme={theme} setTheme={handleThemeChange}>
      <SafeAreaView style={{ flex: 1 }}>
        <Slot />
      </SafeAreaView>
    </ThemeProvider>
  );
};

export default function Layout() {
  return (
    <ToastProvider>
      <AuthProvider>
        <DataProvider>
          <AppContainer />
        </DataProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
