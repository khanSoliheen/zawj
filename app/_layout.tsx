import { Slot } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemeProvider } from './theme/context';
import { useTheme } from './theme/useTheme';
import './i18n';

export default function Layout() {
  return (
    <ThemeProvider>
      <RootLayoutContent />
    </ThemeProvider>
  );
}

function RootLayoutContent() {
  const theme = useTheme();
  
  return (
    <SafeAreaView style={{ 
      flex: 1, 
      backgroundColor: theme.background 
    }}>
      <Slot />
    </SafeAreaView>
  );
}
