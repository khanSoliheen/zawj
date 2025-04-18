// components/Input.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Controller, Control, FieldError } from 'react-hook-form';
import { TextInput, Text, View, StyleSheet, TextInputProps, TouchableOpacity } from 'react-native';

import { commonStyles } from '@/app/common/commonUtils';
import { useThemeContext } from '@/app/theme/context';

interface InputProps extends TextInputProps {
  name: string;
  control: Control<any>;
  label?: string;
  error?: FieldError;
  secureTextEntry?: boolean;
  email?: boolean;
  required?: boolean;
}

export default function Input({ name, control, label, error, secureTextEntry, required, email, ...rest }: InputProps) {
  const { theme } = useThemeContext();
  const [showSecureText, setShowSecureText] = React.useState(secureTextEntry);
  return (
    <View style={{ marginBottom: 16 }}>
      {label && <Text style={[styles.label, { color: theme.text }]}>{label}</Text>}

      <Controller
        name={name}
        control={control}
        rules={{
          ...(required && { required: `This is required field` }),
          ...(email && {
            pattern: {
              value: /^\S+@\S+$/i,
              message: 'Invalid email format',
            }
          }),
        }}
        render={({ field: { onChange, value, onBlur } }) => (
          <View style={{ position: 'relative' }}>
            <TextInput
              style={[styles.input, { borderColor: theme.border, color: theme.text }]}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              placeholderTextColor={theme.text}
              secureTextEntry={showSecureText}
              {...rest}
            />
            {secureTextEntry &&
              <TouchableOpacity
                onPress={() => setShowSecureText(prev => !prev)}
                style={{ position: 'absolute', right: 12, top: 12 }}
              >
                <Ionicons
                  name={!showSecureText ? 'eye' : 'eye-off'}
                  size={20}
                  color={theme.accent}
                />
              </TouchableOpacity>
            }
          </View>
        )}
      />
      {error && <Text style={commonStyles.errorText}>{error.message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  label: {
    marginBottom: 4,
    fontWeight: '600',
  },
});
