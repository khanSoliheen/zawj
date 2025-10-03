// app/register/step3.tsx
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

import { Block, Button, Image, Input, SelectInput, Text } from '@/components';
import { useData } from '@/hooks';
import { useRegistrationStore } from '@/store/registration';

const schema = z.object({
  maritalStatus: z.enum(['Single', 'Married', 'Divorced', 'Widowed'], { error: 'Please select a marital status' }),
  waliName: z.string().optional(),
  waliRelation: z.string().optional(),
  waliContact: z.string().optional(),
  childrenCount: z.string().regex(/^\d+$/, 'Enter a valid number').optional(),
  childrenDetails: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function Step3() {
  const router = useRouter();
  const { data, setData } = useRegistrationStore();
  const { theme } = useData();
  const { colors, sizes, gradients, assets } = theme;

  const {
    control,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useForm<FormValues>({
    resolver: zodResolver(schema as any),
    defaultValues: data,
  });

  const maritalStatus = useWatch({ control, name: 'maritalStatus' });

  const onSubmit = (values: FormValues) => {
    setData(values);
    router.push('/register/step4');
  };

  return (
    <Block safe keyboard color={colors.background} >
      <Block scroll paddingHorizontal={sizes.s} showsVerticalScrollIndicator={false}>
        {/* Back + Title */}
        <Block row flex={0} align="center" justify="flex-start" marginBottom={sizes.md}>
          <Button onPress={() => router.back()} row flex={0} align="center" justify="center">
            <Image
              radius={0}
              width={10}
              height={18}
              color={colors.text}
              source={assets.arrow}
              transform={[{ rotate: '180deg' }]}
            />
          </Button>
          <Text h4 marginLeft={sizes.s}>Step 3: Marital Info</Text>
        </Block>

        {/* Marital Status */}
        <Block flex={0} style={{ zIndex: 0 }}>
          <Controller
            control={control}
            name="maritalStatus"
            render={({ field, fieldState }) => (
              <SelectInput
                label="Marital Status"
                options={['Single', 'Married', 'Divorced', 'Widowed']}
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />
        </Block>

        {/* Wali Name */}
        <Block flex={0} style={{ zIndex: 0 }} >
          <Controller
            control={control}
            name="waliName"
            render={({ field, fieldState }) => (
              <Input
                id="waliName"
                label="Wali Name (if female)"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                ref={field.ref}
                error={fieldState.error?.message}
                success={dirtyFields.waliName && !errors.waliName}
                placeholder="Enter wali name"
                marginBottom={12}
              />
            )}
          />
        </Block>

        {/* Wali Relation */}
        <Block flex={0} style={{ zIndex: 0 }} >
          <Controller
            control={control}
            name="waliRelation"
            render={({ field, fieldState }) => (
              <Input
                id="waliRelation"
                label="Wali Relation"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                ref={field.ref}
                error={fieldState.error?.message}
                success={dirtyFields.waliRelation && !errors.waliRelation}
                placeholder="e.g. Father / Brother"
                marginBottom={12}
              />
            )}
          />
        </Block>

        {/* Wali Contact */}
        <Block flex={0} style={{ zIndex: 0 }} >
          <Controller
            control={control}
            name="waliContact"
            render={({ field, fieldState }) => (
              <Input
                id="waliContact"
                label="Wali Contact"
                keyboardType="phone-pad"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                ref={field.ref}
                error={fieldState.error?.message}
                success={dirtyFields.waliContact && !errors.waliContact}
                placeholder="+91 9876543210"
                marginBottom={12}
              />
            )}
          />
        </Block>

        {/* Conditional Children Info */}
        {(maritalStatus === 'Divorced' || maritalStatus === 'Widowed') && (
          <>
            <Block flex={0} style={{ zIndex: 0 }} >
              <Controller
                control={control}
                name="childrenCount"
                render={({ field, fieldState }) => (
                  <Input
                    id="childrenCount"
                    label="Number of Children"
                    keyboardType="numeric"
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    error={fieldState.error?.message}
                    success={dirtyFields.childrenCount && !errors.childrenCount}
                    placeholder="e.g. 2"
                    marginBottom={12}
                  />
                )}
              />
            </Block>

            <Block flex={0} style={{ zIndex: 0 }} >
              <Controller
                control={control}
                name="childrenDetails"
                render={({ field, fieldState }) => (
                  <Input
                    id="childrenDetails"
                    label="Children Details (ages, gender, custody)"
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    error={fieldState.error?.message}
                    success={dirtyFields.childrenDetails && !errors.childrenDetails}
                    placeholder="e.g. 1 son (5), 1 daughter (3)"
                    marginBottom={12}
                  />
                )}
              />
            </Block>
          </>
        )}

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
