import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Link } from 'expo-router';
import { useExpoRouter } from 'expo-router/build/global-state/router-store';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { ScrollView } from 'react-native';

import { commonStyles, showToaster } from '@/app/common/commonUtils';
import { useThemeContext } from '@/app/theme/context';

import { Input, CustomButton } from '../components';
import { RegisterFormData } from '../interface/Interfaces';

export default function Register() {
  const router = useExpoRouter();
  const { theme } = useThemeContext();
  const { t } = useTranslation();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    defaultValues: {
      gender: 'male',
    },
  });
  const password = watch('password');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = (_: RegisterFormData) => {
    showToaster("Registration is successful")
    router.push('/login');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
          <Text style={styles.header}>Register</Text>

          <Input
            name="firstName"
            control={control}
            placeholder="First Name"
            error={errors.firstName}
          />
          <Input
            name="lastName"
            control={control}
            placeholder="Last Name"
            error={errors.lastName}
          />
          <Input
            name="email"
            control={control}
            placeholder="Email"
            error={errors.email}
          />
          <View style={[commonStyles.formInputView]}>

            {/* Gender */}
            <Controller
              name="gender"
              control={control}
              rules={{ required: 'Gender is required' }}
              render={({ field: { onChange, value } }) => (
                <View style={styles.genderContainer}>
                  <TouchableOpacity onPress={() => onChange('male')}>
                    <View style={[styles.genderOption, value === 'male' && styles.selected]}>
                      <Text style={styles.icon}>🧔‍♂️</Text>
                      <Text>Male</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => onChange('female')}>
                    <View style={[styles.genderOption, value === 'female' && styles.selected]}>
                      <Text style={styles.icon}>🧕</Text>
                      <Text>Female</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            />
            {errors.gender && <Text style={[commonStyles.errorText]}>{errors.gender.message}</Text>}
          </View>
          <View style={[commonStyles.formInputView]}>
            {/* Date of Birth */}
            <Controller
              name="dateOfBirth"
              control={control}
              rules={{ required: 'Date of Birth is required' }}
              render={({ field: { onChange, value } }) => (
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                  <TextInput
                    placeholder="Date of Birth"
                    value={value}
                    editable={false}
                    style={[styles.input, { borderColor: theme.border }]}
                    placeholderTextColor={theme.text}
                  />
                  {showDatePicker && (
                    <DateTimePicker
                      mode="date"
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      value={value ? new Date(value) : new Date()}
                      onChange={(_, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) {
                          onChange(selectedDate.toISOString().split('T')[0]);
                        }
                      }}
                    />
                  )}
                </TouchableOpacity>
              )}
            />
            {errors.dateOfBirth && <Text style={[commonStyles.errorText]}>{errors.dateOfBirth.message}</Text>}
          </View>
          <Input
            name="password"
            control={control}
            secureTextEntry={true}
            placeholder="Password"
            error={errors.password}
          />
          <Input
            name="confirmPassword"
            control={control}
            secureTextEntry={true}
            placeholder="Confirm Password"
            error={errors.confirmPassword}
          />
          <CustomButton
            onPress={handleSubmit(onSubmit)}
            title={t('register_page.button.register')}
          />
          <Link href="/" asChild>
            <Text style={{ padding: 20 }}>{t('register_page.backToLogin')}</Text>
          </Link>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    // marginBottom: 15,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 15,
  },
  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    borderColor: '#ccc',
  },
  selected: {
    borderColor: '#5f795f',
    backgroundColor: '#f6f1ea',
  },
  icon: {
    fontSize: 18,
    marginRight: 8,
  },
});
