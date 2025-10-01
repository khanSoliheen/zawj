import { zodResolver } from '@hookform/resolvers/zod';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Linking, Platform, TouchableOpacity } from 'react-native';
import { z } from 'zod';

import { Block, Button, Image, Input, Text } from '@/components';
import Checkbox from '@/components/checkbox';
import { useData } from '@/hooks';


const isAndroid = Platform.OS === 'android';

/* Zod schema */
const schema = z
  .object({
    firstName: z.string().min(2, 'Min 2 characters'),
    lastName: z.string().min(2, 'Min 2 characters'),
    email: z.email('Enter a valid email'),
    gender: z.enum(['male', 'female']).optional(),
    dob: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD')
      .optional(),
    password: z.string().min(6, 'Min 6 characters'),
    confirmPassword: z.string().min(6, 'Min 6 characters'),
    termsAndConditions: z.boolean().refine((v) => v === true, {
      message: 'You must agree to continue',
    }),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      });
    }
  });

type FormValues = z.infer<typeof schema>;

export default function Login() {
  const { isDark, theme } = useData()
  const { colors, gradients, sizes, assets } = theme;
  const router = useRouter();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [secureTextEntry, _] = useState(true);

  const {
    control,
    handleSubmit,
    setFocus,
    formState: { errors, dirtyFields, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema as any),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      gender: undefined,
      dob: undefined,
      password: '',
      confirmPassword: '',
      termsAndConditions: false,
    },
  });

  function onSubmit(_: FormValues) {
    router.push('/login');
  };

  const onInvalid = () => {
    const [firstKey] = Object.keys(errors);
    if (firstKey) setFocus(firstKey as any);
  };

  return (
    <Block white safe marginTop={sizes.md}>
      <Block paddingHorizontal={sizes.s}>
        <Block flex={0} style={{ zIndex: 0 }}>
          <Image
            background
            resizeMode="cover"
            padding={sizes.sm}
            radius={sizes.cardRadius}
            source={assets.background}
            height={sizes.height * 0.3}>
            <Button
              row
              flex={0}
              justify="flex-start"
              onPress={() => router.back()}>
              <Image
                radius={0}
                width={10}
                height={18}
                color={colors.white}
                source={assets.arrow}
                transform={[{ rotate: '180deg' }]}
              />
              <Text p white marginLeft={sizes.s}>
                Go Back
              </Text>
            </Button>

            <Text h4 center white marginBottom={sizes.md}>
              Register
            </Text>
          </Image>
        </Block>
        {/* register form */}
        <Block
          keyboard
          behavior={!isAndroid ? 'padding' : 'height'}
          marginTop={-(sizes.height * 0.2 - sizes.l)}>
          <Block
            flex={0}
            radius={sizes.sm}
            marginHorizontal="8%"
            shadow={!isAndroid} // disabled shadow on Android due to blur overlay + elevation issue
          >
            <Block
              blur
              flex={0}
              intensity={90}
              radius={sizes.sm}
              overflow="hidden"
              justify="space-evenly"
              tint={colors.blurTint}
              paddingVertical={sizes.sm}>
              <Text p semibold center>
                Register with {showDatePicker}
              </Text>
              {/* social buttons */}
              <Block row center justify="space-evenly" marginVertical={sizes.m}>
                <Button outlined gray shadow={!isAndroid}>
                  <Image
                    source={assets.facebook}
                    height={sizes.m}
                    width={sizes.m}
                    color={isDark ? colors.icon : undefined}
                  />
                </Button>
                <Button outlined gray shadow={!isAndroid}>
                  <Image
                    source={assets.apple}
                    height={sizes.m}
                    width={sizes.m}
                    color={isDark ? colors.icon : undefined}
                  />
                </Button>
                <Button outlined gray shadow={!isAndroid}>
                  <Image
                    source={assets.google}
                    height={sizes.m}
                    width={sizes.m}
                    color={isDark ? colors.icon : undefined}
                  />
                </Button>
              </Block>
              <Block
                row
                flex={0}
                align="center"
                justify="center"
                marginBottom={sizes.sm}
                paddingHorizontal={sizes.xxl}>
                <Block
                  flex={0}
                  height={1}
                  width="50%"
                  end={[1, 0]}
                  start={[0, 1]}
                  gradient={gradients.divider}
                />
                <Text center marginHorizontal={sizes.s}>
                  or
                </Text>
                <Block
                  flex={0}
                  height={1}
                  width="50%"
                  end={[0, 1]}
                  start={[1, 0]}
                  gradient={gradients.divider}
                />
              </Block>
              <Block paddingHorizontal={sizes.sm}>
                {/* form inputs */}
                <Controller
                  control={control}
                  name="firstName"
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <Input
                      id="firstName"
                      label="First Name"
                      autoCapitalize="words"
                      autoCorrect={false}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      ref={ref}
                      error={errors.firstName?.message}
                      success={dirtyFields.firstName && !errors.firstName}
                      placeholder="your first name"
                      marginBottom={sizes.m}
                    />
                  )}
                />
                {/* last name */}
                <Controller
                  control={control}
                  name="lastName"
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <Input
                      id="lastName"
                      label="Last Name"
                      autoCapitalize="words"
                      autoCorrect={false}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      ref={ref}
                      error={errors.lastName?.message}
                      success={dirtyFields.lastName && !errors.lastName}
                      placeholder="your last name"
                      marginBottom={sizes.m}
                    />
                  )}
                />
                {/* Email Field */}
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <Input
                      id="email"
                      label="Email"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      ref={ref}
                      error={errors.email?.message}
                      success={dirtyFields.email && !errors.email}
                      placeholder="you@example.com"
                      marginBottom={sizes.m}
                    />
                  )}
                />
                {/* gender */}
                <Controller
                  control={control}
                  name="gender"
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <Input
                      id="gender"
                      label="Gender (male/female)"
                      autoCapitalize="none"
                      value={value ?? ''}
                      onChangeText={(txt) => onChange(txt.trim().toLowerCase())}
                      onBlur={onBlur}
                      ref={ref}
                      error={errors.gender?.message}
                      success={dirtyFields.gender && !errors.gender}
                      placeholder="male / female"
                      marginBottom={sizes.m}
                    />
                  )}
                />
                {/* DOB */}
                <Controller
                  control={control}
                  name="dob"
                  render={({ field: { onChange, value } }) => (
                    <TouchableOpacity onPress={() => setShowDatePicker(prev => !prev)}>
                      <Input
                        placeholder="Date of Birth"
                        value={value}
                        label='DOB'
                        editable={false}
                        pointerEvents='none'
                        marginBottom={sizes.m}
                      />
                      {showDatePicker && (
                        <DateTimePicker
                          mode="date"
                          textColor="black"
                          maximumDate={new Date()}
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
                {/* Password Field */}
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <Input
                      id="password"
                      label="Password"
                      secureTextEntry={secureTextEntry}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      ref={ref}
                      placeholder="********"
                      marginBottom={sizes.m}
                    />
                  )}
                />
                {/* confirm password */}
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <Input
                      id="confirmPassword"
                      label="Confirm Password"
                      secureTextEntry={secureTextEntry}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      ref={ref}
                      placeholder="********"
                      marginBottom={sizes.m}
                    />
                  )}
                />
                {/* Terms & Conditions */}
                <Controller
                  control={control}
                  name="termsAndConditions"
                  render={({ field: { value, onChange } }) => (
                    <Checkbox
                      id="terms"
                      marginRight={sizes.s}
                      checked={!!value}
                      onPress={(next) => onChange(next)}
                    />
                  )}
                />
                <Text paddingRight={sizes.s}>
                  I agree with the{' '}
                  <Text
                    semibold
                    color={colors.link}
                    onPress={() =>
                      Linking.openURL('https://www.creative-tim.com/terms')
                    }
                  >
                    Terms and Conditions
                  </Text>
                </Text>
                {!!errors.termsAndConditions?.message && (
                  <Text color="danger" marginLeft={sizes.s} marginTop={sizes.xs}>
                    {errors.termsAndConditions.message}
                  </Text>
                )}

                {/* Submit */}
                <Button
                  disabled={isSubmitting}
                  shadow={!isAndroid}
                  gradient={gradients.primary}
                  marginTop={sizes.s}
                  onPress={handleSubmit(onSubmit, onInvalid)}
                >
                  <Text white >
                    Sign up
                  </Text>
                </Button>
              </Block>
            </Block>
          </Block>
        </Block>
      </Block>
    </Block>
  );
}
