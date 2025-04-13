// app/welcome.tsx
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from './theme/useTheme';
import { useTranslation } from 'react-i18next';
import { Link } from 'expo-router';

export default function Welcome() {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
      {/* Logo */}
      <Text style={[styles.logoArabic, { color: theme.primary }]}>أزواج</Text>
      <Text style={[styles.logoText, { color: theme.text }]}>Zawj</Text>

      {/* Tagline */}
      <Text style={[styles.tagline, { color: theme.text }]}>{t('Find Your Life Partner')}</Text>

      {/* Get Started Button */}
      <Link href="./login" asChild>
        <TouchableOpacity style={[styles.primaryButton, { backgroundColor: theme.primary }]}>
          <Text style={styles.primaryButtonText}>{t('Get Started')}</Text>
        </TouchableOpacity>
      </Link>

      {/* How It Works */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('How It Works')}</Text>
      <View style={styles.stepList}>
        <Text style={[styles.stepItem, { color: theme.text }]}>1. Create a profile</Text>
        <Text style={[styles.stepItem, { color: theme.text }]}>2. Browse profiles</Text>
        <Text style={[styles.stepItem, { color: theme.text }]}>3. Connect with matches</Text>
      </View>

      {/* Learn More */}
      <TouchableOpacity style={[styles.outlineButton, { borderColor: theme.accent }]}>
        <Text style={[styles.outlineButtonText, { color: theme.accent }]}>{t('Learn More')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
  },
  logoArabic: {
    fontSize: 48,
    fontWeight: 'bold',
    fontFamily: 'serif', // Replace with Arabic-styled font if available
  },
  logoText: {
    fontSize: 22,
    marginTop: 4,
    marginBottom: 16,
    fontWeight: '500',
  },
  tagline: {
    fontSize: 18,
    marginBottom: 24,
  },
  primaryButton: {
    padding: 14,
    borderRadius: 30,
    minWidth: 200,
    alignItems: 'center',
    marginBottom: 32,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 12,
    fontWeight: '600',
  },
  stepList: {
    marginBottom: 32,
    alignItems: 'flex-start',
  },
  stepItem: {
    fontSize: 16,
    marginVertical: 4,
  },
  outlineButton: {
    borderWidth: 2,
    padding: 12,
    borderRadius: 30,
    paddingHorizontal: 32,
  },
  outlineButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
