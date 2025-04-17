import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useExpoRouter } from 'expo-router/build/global-state/router-store';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
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


import { RegisterFormData } from './interface/Interfaces';



export default function Register() {
  const router = useExpoRouter();
  const { theme } = useThemeContext();
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

          {/* First Name */}
          <Controller
            name="firstName"
            control={control}
            rules={{ required: 'First name is required' }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="First Name"
                value={value}
                onChangeText={onChange}
                style={[styles.input, { borderColor: theme.border }]}
                placeholderTextColor={theme.text}
              />
            )}
          />
          {errors.firstName && <Text style={[commonStyles.errorText]}>{errors.firstName.message}</Text>}
          {/* Last Name */}
          <Controller
            name="lastName"
            control={control}
            rules={{ required: 'Last name is required' }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Last Name"
                value={value}
                onChangeText={onChange}
                style={[styles.input, { borderColor: theme.border }]}
                placeholderTextColor={theme.text}
              />
            )}
          />
          {errors.lastName && <Text style={[commonStyles.errorText]}>{errors.lastName.message}</Text>}
          {/* Email */}
          <Controller
            name="email"
            control={control}
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Invalid email format',
              },
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Email"
                value={value}
                onChangeText={onChange}
                style={[styles.input, { borderColor: theme.border }]}
                placeholderTextColor={theme.text}
              />
            )}
          />
          {errors.email && <Text style={[commonStyles.errorText]}>{errors.email.message}</Text>}
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
          {/* Password */}
          <Controller
            name="password"
            control={control}
            rules={{ required: 'Password is required' }}
            render={({ field: { onChange, value } }) => (
              <View style={{ position: 'relative' }}>
                <TextInput
                  placeholder="Password"
                  secureTextEntry={!showPassword}
                  value={value}
                  onChangeText={onChange}
                  style={[styles.input, { borderColor: theme.border, paddingRight: 40 }]}
                  placeholderTextColor={theme.text}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(prev => !prev)}
                  style={{ position: 'absolute', right: 12, top: 12 }}
                >
                  <Ionicons
                    name={showPassword ? 'eye' : 'eye-off'}
                    size={20}
                    color={theme.accent}
                  />
                </TouchableOpacity>
              </View>
            )}
          />
          {errors.password && (
            <Text style={commonStyles.errorText}>{errors.password.message}</Text>
          )}

          {/* Confirm Password */}
          <Controller
            name="confirmPassword"
            control={control}
            rules={{ required: 'Confirm Password is required', validate: value => value === password || 'Passwords do not match', }}
            render={({ field: { onChange, value } }) => (
              <View style={{ position: 'relative' }}>
                <TextInput
                  placeholder="Confirm Password"
                  secureTextEntry={!showConfirmPassword}
                  value={value}
                  onChangeText={onChange}
                  style={[styles.input, { borderColor: theme.border, paddingRight: 40 }]}
                  placeholderTextColor={theme.text}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(prev => !prev)}
                  style={{ position: 'absolute', right: 12, top: 12 }}
                >
                  <Ionicons
                    name={showConfirmPassword ? 'eye' : 'eye-off'}
                    size={20}
                    color={theme.accent}
                  />
                </TouchableOpacity>
              </View>
            )}
          />
          {errors.confirmPassword && (
            <Text style={commonStyles.errorText}>{errors.confirmPassword.message}</Text>
          )}
          <TouchableOpacity onPress={handleSubmit(onSubmit)} style={styles.submitButton}>
            <Text style={{ color: 'white' }}>Register</Text>
          </TouchableOpacity>
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
    marginBottom: 15,
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
  submitButton: {
    marginTop: 20,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#5f795f',
    alignItems: 'center',
  },
});
