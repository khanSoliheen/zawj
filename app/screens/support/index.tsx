import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Block, Button, Text, Image, Input } from "@/components";
import { useData, useToast } from "@/hooks";
import { supabase } from "@/utils/supabase";

const schema = z.object({
  subject: z.string().trim().min(4, "Please add a short subject"),
  message: z.string().trim().min(20, "Please describe the issue (min 20 chars)"),
  email: z.email("Enter a valid email"),
});
type FormValues = z.infer<typeof schema>;

export default function ContactSupport() {
  const { theme } = useData();
  const { show } = useToast();
  const { colors, sizes, assets } = theme;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema as any),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: { subject: "", message: "", email: "" },
  });

  // Prefill email from current user
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      const email = data?.user?.email ?? "";
      if (email) reset((prev) => ({ ...prev, email }));
    })();
  }, [reset]);

  const onSubmit = async (values: FormValues) => {
    const { data: auth } = await supabase.auth.getUser();
    const user_id = auth?.user?.id;
    const payload = {
      user_id,
      subject: values.subject,
      message: values.message,
      email: values.email,
      app_version: (globalThis as any)?.expo?.manifest?.version ?? undefined,
      platform: (globalThis as any)?.navigator?.product ?? undefined,
    };

    const { error } = await supabase.from("support_tickets").insert(payload);
    if (error) {
      show("error", error.message);
      return;
    }
    show("success", "Thanks! We’ve received your message.");
    router.back();
  };

  return (
    <Block safe flex={1} color={colors.background} paddingHorizontal={sizes.padding}>
      {/* Header */}
      <Block row flex={0} align="center" justify="space-between" paddingVertical={sizes.s} marginBottom={sizes.sm}>
        <Button onPress={() => router.back()}>
          <Image
            radius={0}
            width={10}
            height={18}
            color={colors.link}
            source={assets.arrow}
            transform={[{ rotate: "180deg" }]}
          />
        </Button>
        <Text h5 semibold>Contact Support</Text>
        <Block width={40} />
      </Block>

      {/* Form */}
      <Block>
        <Controller
          control={control}
          name="subject"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              placeholder="Subject"
              autoCapitalize="sentences"
              autoCorrect
              marginBottom={sizes.s}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              ref={ref}
              error={errors.subject?.message}
              success={dirtyFields.subject && !errors.subject}
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              marginBottom={sizes.s}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              ref={ref}
              error={errors.email?.message}
              success={dirtyFields.email && !errors.email}
            />
          )}
        />

        <Controller
          control={control}
          name="message"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Input
              placeholder="Describe your issue or question…"
              autoCapitalize="sentences"
              autoCorrect
              multiline
              numberOfLines={6}
              marginBottom={sizes.s}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              ref={ref}
              error={errors.message?.message}
              success={dirtyFields.message && !errors.message}
            />
          )}
        />

        <Button
          color={colors.primary}
          marginTop={sizes.s}
          disabled={isSubmitting}
          onPress={handleSubmit(onSubmit)}
        >
          <Text white semibold>{isSubmitting ? "Sending…" : "Send"}</Text>
        </Button>

        <Text size={12} color={colors.gray} marginTop={sizes.s}>
          We’ll get back to you at your email.
        </Text>
      </Block>
    </Block>
  );
}
