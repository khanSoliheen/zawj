// app/register/step1.tsx
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Platform } from 'react-native';
import { z } from 'zod';

import { Block, Button, Image, Input, Text } from '@/components';
import { useData } from '@/hooks';
import { useRegistrationStore } from '@/store/registration';

const isAndroid = Platform.OS === 'android';

const schema = z.object({
  firstName: z.string().min(4, 'Enter your first name'),
  lastName: z.string().min(4, 'Enter your last name'),
  email: z.email('Enter valid email'),
  phone: z.string().min(10, 'Enter valid phone'),
  password: z.string().min(6, 'Min 6 characters'),
  confirmPassword: z.string().min(6, 'Min 6 characters'),
}).superRefine(({ password, confirmPassword }, ctx) => {
  if (password !== confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    });
  }
});

type FormValues = z.infer<typeof schema>;

export default function Step1() {
  const { theme } = useData();
  const { colors, gradients, sizes, assets } = theme;
  const router = useRouter();
  const { setData, data } = useRegistrationStore();

  const {
    control,
    handleSubmit,
    formState: { errors, dirtyFields, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema as any),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: data,
  });

  const onSubmit = (values: FormValues) => {
    setData(values);
    router.push('/register/step2');
  };

  return (
    <Block safe keyboard color={colors.background} marginTop={sizes.md}>
      <Block scroll paddingHorizontal={sizes.s} showsVerticalScrollIndicator={false}>
        <Block row flex={0} align="center" justify="flex-start" marginBottom={sizes.md}>
          {/* Back button */}
          <Button
            onPress={() => router.back()}
            row
            flex={0}
            align="center"
            justify="center"
          >
            <Image
              radius={0}
              width={10}
              height={18}
              color={colors.text}
              source={assets.arrow}
              transform={[{ rotate: '180deg' }]}
            />
          </Button>

          {/* Step Title */}
          <Text h4 marginLeft={sizes.s}>
            Account info step 1
          </Text>
        </Block>

        {/* First Name */}
        <Block flex={0} style={{ zIndex: 0 }}>
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
                marginBottom={12}
              />
            )}
          />
        </Block>

        {/* Last Name */}
        <Block flex={0} style={{ zIndex: 0 }}>
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
                marginBottom={12}
              />
            )}
          />
        </Block>

        {/* Email */}
        <Block flex={0} style={{ zIndex: 0 }}>
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
                marginBottom={12}
              />
            )}
          />
        </Block>

        {/* Phone */}
        <Block flex={0} style={{ zIndex: 0 }}>
          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Input
                id="phone"
                label="Phone Number"
                keyboardType="phone-pad"
                autoCapitalize="none"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                ref={ref}
                error={errors.phone?.message}
                success={dirtyFields.phone && !errors.phone}
                placeholder="+91 9876543210"
                marginBottom={12}
              />
            )}
          />
        </Block>

        {/* Password */}
        <Block flex={0} style={{ zIndex: 0 }}>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Input
                id="password"
                label="Password"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                ref={ref}
                error={errors.password?.message}
                success={dirtyFields.password && !errors.password}
                placeholder="********"
                marginBottom={12}
              />
            )}
          />
        </Block>

        {/* Confirm Password */}
        <Block flex={0} style={{ zIndex: 0 }}>
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Input
                id="confirmPassword"
                label="Confirm Password"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                ref={ref}
                error={errors.confirmPassword?.message}
                success={dirtyFields.confirmPassword && !errors.confirmPassword}
                placeholder="********"
                marginBottom={12}
              />
            )}
          />
        </Block>

        {/* Next Button */}
        <Block flex={0} style={{ zIndex: 0 }}>
          <Button
            disabled={isSubmitting}
            shadow={!isAndroid}
            gradient={gradients.primary}
            onPress={handleSubmit(onSubmit)}
          >
            <Text white>Next</Text>
          </Button>
        </Block>
      </Block>
    </Block >
  );
}
