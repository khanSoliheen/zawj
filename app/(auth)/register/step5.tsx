// app/register/step5.tsx
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Block, Button, Image, Text } from '@/components';
import Checkbox from '@/components/checkbox';
import { useData } from '@/hooks';
import { useRegistrationStore } from '@/store/registration';

const schema = z.object({
  termsAccepted: z.literal(true, { error: 'You must accept the Terms' }),
  islamicPolicyAccepted: z.literal(true, { error: 'You must accept the Islamic Usage Policy' }),
});

type FormValues = z.infer<typeof schema>;

export default function Step5() {
  const router = useRouter();
  const { setData, data, reset } = useRegistrationStore();
  const { theme } = useData();
  const { colors, sizes, gradients, assets } = theme;

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema as any),
    // defaultValues: data,
  });

  const onSubmit = async (values: FormValues) => {
    setData(values);
    const finalPayload = { ...data, ...values };
    console.log("Submitting to backend:", finalPayload);

    // TODO: call API
    reset();
    router.replace('/login'); // go to main app
  };

  return (
    <Block safe color={colors.background} marginTop={sizes.md}>
      <Block paddingHorizontal={sizes.s}>
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
          <Text h4 marginLeft={sizes.s}>Step 5: Agreements</Text>
        </Block>

        {/* Terms & Conditions */}
        <Block row flex={0} style={{ zIndex: 0 }}>
          <Controller
            control={control}
            name="termsAccepted"
            render={({ field }) => (
              <Block row center>
                <Checkbox
                  checked={!!field.value}
                  onPress={field.onChange}
                  marginRight={sizes.s}
                />
                <Text>I agree to Terms & Conditions</Text>
              </Block>
            )}
          />
        </Block>
        <Block row center flex={0} style={{ zIndex: 0 }}>
          {errors.termsAccepted?.message && (
            <Text color={colors.danger} marginTop={sizes.xs}>
              {errors.termsAccepted.message}
            </Text>
          )}
        </Block>

        {/* Islamic Policy */}
        <Block row flex={0} center style={{ zIndex: 0 }} marginTop={sizes.md}>
          <Controller
            control={control}
            name="islamicPolicyAccepted"
            render={({ field }) => (
              <Block row center>
                <Checkbox
                  checked={!!field.value}
                  onPress={field.onChange}
                  marginRight={sizes.s}
                />
                <Text>I agree to Islamic Usage Policy</Text>
              </Block>
            )}
          />
        </Block>
        <Block row center flex={0} style={{ zIndex: 0 }}>
          {errors.islamicPolicyAccepted?.message && (
            <Text color={colors.danger} marginTop={sizes.xs}>
              {errors.islamicPolicyAccepted.message}
            </Text>
          )}
        </Block>
        {/* Submit Button */}
        <Block flex={0} style={{ zIndex: 0 }} marginTop={sizes.l}>
          <Button onPress={handleSubmit(onSubmit)} gradient={gradients.primary}>
            <Text white>Submit</Text>
          </Button>
        </Block>
      </Block>
    </Block>
  );
}
