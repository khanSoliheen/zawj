// app/welcome.tsx
import { Link } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';

import logo from './assets/images/carousel1.png';

// import { useTheme } from './theme/useTheme';

export default function Welcome() {
  // const theme = useTheme();
  const { t } = useTranslation();
  return (
    <ScrollView contentContainerStyle={{ ...styles.container }}>
      {/* Logo */}
      <Image
        style={styles.tinyLogo}
        source={logo}
      />
      {/* Tagline */}
      <Text style={{ ...styles.tagline }}>{t('find_your_life_partner')}</Text>

      {/* Get Started Button */}
      <Link href="./login" asChild>
        <TouchableOpacity style={{ ...styles.primaryButton }}>
          <Text style={{ ...styles.outlineButtonText }}>{t('button.get_started')}</Text>
        </TouchableOpacity>
      </Link>
      <Link style={{ margin: 10 }} href="./home" asChild>
        <TouchableOpacity style={{ ...styles.primaryButton }}>
          <Text style={{ ...styles.outlineButtonText }}>Straight To Home</Text>
        </TouchableOpacity>
      </Link>


      {/* How It Works */}
      <Text style={{ ...styles.sectionTitle }}>{t('how_it_works')}</Text>
      <View style={styles.stepList}>
        <Text style={{ ...styles.stepItem }}>1. Create a profile</Text>
        <Text style={{ ...styles.stepItem }}>2. Browse profiles</Text>
        <Text style={{ ...styles.stepItem }}>3. Connect with matches</Text>
      </View>

      {/* Learn More */}
      <TouchableOpacity style={{ ...styles.primaryButton, borderWidth: 2, borderRadius: '30%' }}>
        <Text style={{ ...styles.outlineButtonText }}>{t('button.learn_more')}</Text>
      </TouchableOpacity>
    </ScrollView >
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
  },
  tagline: {
    fontSize: 18,
    marginBottom: 24,
  },
  primaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '60%',
    borderRadius: '10%',
    height: '7%',
  },
  primaryButtonText: {
    fontSize: 50,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    margin: 20,
    fontWeight: '600',
    alignItems: 'flex-start',
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
  tinyLogo: {
    width: 300,
    height: 220,
  },
});
