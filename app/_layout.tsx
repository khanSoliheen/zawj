import { Slot } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DataProvider } from './hooks/useData';
import { ThemeProvider } from './hooks/useTheme';


export default function Layout() {
  return (
    <DataProvider>
      <ThemeProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <Slot />
        </SafeAreaView>
      </ThemeProvider>
    </DataProvider>
  );
}
