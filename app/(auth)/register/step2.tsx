// app/register/step2.tsx
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Block, Button, Image, Input, SelectInput, Text } from '@/components';
import DateInput from '@/components/date-picker';
import { useData } from '@/hooks';
import { useRegistrationStore } from '@/store/registration';

const schema = z.object({
  gender: z.enum(['Male', 'Female'], { error: 'Please select your gender' }),
  dob: z.string().min(4, 'Enter DOB (YYYY-MM-DD)'),
  country: z.string().min(4, 'Enter a valid country'),
  state: z.string().min(4, 'Enter a valid state'),
  city: z.string().min(4, 'Enter a valid city'),
  education: z.string().min(4, 'Enter a valid nationality'),
  employmentType: z.string().min(4, 'Enter a valid employment type'),
  designation: z.string().min(4, 'Enter a valid designation'),
  department: z.string().min(4, 'Enter a valid department'),
});

type FormValues = z.infer<typeof schema>;

export default function Step2() {
  const { setData, data } = useRegistrationStore();
  const { theme } = useData();
  const { colors, sizes, gradients, assets } = theme;

  const {
    control,
    handleSubmit,
    formState: { errors, dirtyFields }
  } = useForm<FormValues>({
    resolver: zodResolver(schema as any),
    defaultValues: data,
  });

  const onSubmit = (values: FormValues) => {
    setData(values);
    router.push('/register/step3');
  };

  return (
    <Block safe keyboard color={colors.background} >
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
          <Text h4 marginLeft={sizes.s}> Step 2: Identity</Text>
        </Block>
        {/* Gender */}
        <Block flex={0} style={{ zIndex: 0 }}>
          <Controller
            control={control}
            name="gender"
            render={({ field, fieldState }) => (
              <SelectInput
                label="Gender"
                options={['Male', 'Female']}
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />
        </Block>

        {/* DOB */}
        <Block flex={0} style={{ zIndex: 0 }} >
          <Controller
            control={control}
            name="dob"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <DateInput
                label="Date of Birth"
                placeholder="YYYY-MM-DD"
                value={value}
                error={error?.message}
                onChange={onChange}
                minimumDate={new Date(1950, 0, 1)} // optional
                maximumDate={new Date()}            // today
              />
            )}
          />
        </Block>

        {/* Country */}
        <Block flex={0} style={{ zIndex: 0 }} >
          <Controller
            control={control}
            name="country"
            render={({ field, fieldState }) => (
              <Input
                id="country"
                label="Country"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                ref={field.ref}
                error={fieldState.error?.message}
                success={dirtyFields.country && !errors.country}
                placeholder="Enter your country"
                marginBottom={12}
              />
            )}
          />
        </Block>

        {/* State */}
        <Block flex={0} style={{ zIndex: 0 }} >
          <Controller
            control={control}
            name="state"
            render={({ field, fieldState }) => (
              <Input
                id="state"
                label="State"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                ref={field.ref}
                error={fieldState.error?.message}
                success={dirtyFields.state && !errors.state}
                placeholder="Enter your state"
                marginBottom={12}
              />
            )}
          />
        </Block>

        {/* City */}
        <Block flex={0} style={{ zIndex: 0 }} >
          <Controller
            control={control}
            name="city"
            render={({ field, fieldState }) => (
              <Input
                id="city"
                label="City"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                ref={field.ref}
                error={fieldState.error?.message}
                success={dirtyFields.city && !errors.city}
                placeholder="Enter your city"
                marginBottom={12}
              />
            )}
          />
        </Block>

        {/* Education */}
        <Block flex={0} style={{ zIndex: 0 }} >
          <Controller
            control={control}
            name="education"
            render={({ field, fieldState }) => (
              <Input
                id="education"
                label="Education"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                ref={field.ref}
                error={fieldState.error?.message}
                success={dirtyFields.education && !errors.education}
                placeholder="Enter your education"
                marginBottom={12}
              />
            )}
          />
          <Controller
            control={control}
            name="employmentType"
            render={({ field, fieldState }) => (
              <Input
                id="employmentType"
                label="Employment Type"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                ref={field.ref}
                error={fieldState.error?.message}
                success={dirtyFields.employmentType && !errors.employmentType}
                placeholder="Private Government..."
                marginBottom={12}
              />
            )}
          />
          <Controller
            control={control}
            name="department"
            render={({ field, fieldState }) => (
              <Input
                id="department"
                label="Department"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                ref={field.ref}
                error={fieldState.error?.message}
                success={dirtyFields.department && !errors.department}
                placeholder="Engineering Sales..."
                marginBottom={12}
              />
            )}
          />
          <Controller
            control={control}
            name="designation"
            render={({ field, fieldState }) => (
              <Input
                id="designation"
                label="Designation"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                ref={field.ref}
                error={fieldState.error?.message}
                success={dirtyFields.designation && !errors.designation}
                placeholder="Software Engineer Network Engineer..."
                marginBottom={12}
              />
            )}
          />
        </Block>

        {/* Next Button */}
        <Block flex={0} style={{ zIndex: 0 }} >
          <Button onPress={handleSubmit(onSubmit)} gradient={gradients.primary}>
            <Text white>Next</Text>
          </Button>
        </Block>
      </Block>
    </Block>
  );
}
