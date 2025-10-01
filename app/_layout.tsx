import { Slot } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

// import { ThemeProvider, useThemeContext } from './theme/context';
// import './i18n';

export default function Layout() {
  // const { theme } = useThemeContext();
  return (
    // <ThemeProvider>
    <SafeAreaView style={{ flex: 1 }}>
      <Slot />
    </SafeAreaView>
    // </ThemeProvider>
  );
}
