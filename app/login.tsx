import { Link, useRouter } from 'expo-router';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';

import logo from "@/assets/images/logo.png";

import { useThemeContext } from './theme/context';

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
    router.push('/');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Image style={styles.logo} source={logo} />

      {/* Email Field */}
      <Controller
        control={control}
        name="email"
        rules={{
          required: 'Email is required',
          pattern: {
            value: /^\S+@\S+$/i,
            message: 'Invalid email format',
          },
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder={t('login_page.email')}
            value={value}
            placeholderTextColor={theme.muted}
            style={[styles.input, { borderColor: theme.border, color: theme.text }]}
            onChangeText={onChange}
          />
        )}
      />
      {errors.email && <Text style={[styles.errorText]}>{errors.email.message}</Text>}

      {/* Password Field */}
      <Controller
        control={control}
        name="password"
        rules={{
          required: 'Password is required',
          minLength: { value: 6, message: 'Minimum 6 characters' },
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder={t('login_page.password')}
            value={value}
            secureTextEntry
            placeholderTextColor={theme.muted}
            style={[styles.input, { borderColor: theme.border, color: theme.text }]}
            onChangeText={onChange}
          />
        )}
      />
      {errors.password && <Text style={[styles.errorText]}>{errors.password.message}</Text>}

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

      <Link href="../register" asChild>
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
