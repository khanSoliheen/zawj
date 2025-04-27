import { Link, useRouter } from 'expo-router';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';

import logo from "@/assets/images/logo.png";

import Input from '../components/input';
import { useThemeContext } from '../theme/context';

interface LoginFormData {
  email: string;
  password: string;
}

export default function Login() {
  const { theme } = useThemeContext();
  const { t } = useTranslation();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (_: LoginFormData) => {
    router.push('/home');
  };

  return (
    <View style={[styles.container]}>
      <Image style={styles.logo} source={logo} />

      {/* Email Field */}
      <Input control={control}
        name="email"
        error={errors.email}
        placeholder={t('login_page.email')}
        email={true}
        required={true}
      />
      {/* Password Field */}
      <Input control={control}
        name="password"
        error={errors.password}
        placeholder={t('login_page.password')}
        secureTextEntry={true}
        required={true}
      />

      <TouchableOpacity
        style={[
          styles.LoginButton,
          { backgroundColor: theme.highlight, borderColor: theme.highlight },
        ]}
        onPress={handleSubmit(onSubmit)}
      >
        <Text style={[styles.outlineButtonText, { color: theme.button.text }]}>
          {t('login_page.button.text')}
        </Text>
      </TouchableOpacity>

      <Link href="./register" asChild>
        <Text style={{ ...styles.registerLink, color: theme.accent }}>{t('login_page.register')}</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
  },
  logo: {
    width: 300,
    height: 300,
    alignSelf: 'center',
    marginBottom: 20,
  },
  LoginButton: {
    height: 45,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  outlineButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerLink: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
  },
  input: {
    height: 45,
    marginBottom: 12,
    borderWidth: 1,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 4,
  },
});
