import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Block, Button, Text, Image, Input } from "@/components";
import { useData, useToast } from "@/hooks";
import { supabase } from "@/utils/supabase";

// Categories you want to support
const CATEGORIES = [
  "Harassment",
  "Inappropriate Content",
  "Scam / Fraud",
  "Impersonation",
  "Hate Speech",
  "Other",
] as const;

const schema = z.object({
  category: z.enum(CATEGORIES, { error: "Please pick a category" }),
  reported_user_id: z.string().trim().optional(), // if the report is about a specific user
  details: z
    .string()
    .trim()
    .min(20, "Please provide at least 20 characters"),
  contact_ok: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function ReportMisconduct() {
  const { theme } = useData();
  const { show } = useToast();
  const { colors, sizes, assets } = theme;
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, dirtyFields },
  } = useForm<FormValues>({
    resolver: zodResolver(schema as any),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      category: undefined as unknown as FormValues["category"],
      reported_user_id: "",
      details: "",
      contact_ok: true,
    },
  });

  const category = watch("category");

  const onPick = (c: FormValues["category"]) => () => setValue("category", c, { shouldDirty: true, shouldValidate: true });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const { data: auth } = await supabase.auth.getUser();
      const user_id = auth?.user?.id;
      if (!user_id) {
        show("error", "You must be signed in to submit a report.");
        setSubmitting(false);
        return;
      }

      const payload = {
        user_id,
        category: values.category,
        details: values.details,
        reported_user_id: values.reported_user_id || null,
        contact_ok: !!values.contact_ok,
      };

      const { error } = await supabase.from("reports").insert(payload);
      if (error) {
        show("error", error.message);
        setSubmitting(false);
        return;
      }

      show("success", "Report submitted. Our team will review it.");
      router.back();
    } catch (e: any) {
      show("error", e?.message || "Failed to submit report");
      setSubmitting(false);
    }
  };

  const CategoryPill = ({ label }: { label: FormValues["category"] }) => {
    const active = category === label;
    return (
      <Button onPress={onPick(label)}>
        <Block
          paddingHorizontal={sizes.s}
          paddingVertical={6}
          radius={12}
          color={active ? colors.primary : "rgba(127,127,127,0.12)"}
          style={{ marginRight: sizes.s, marginBottom: sizes.s }}
        >
          <Text p semibold color={active ? "#fff" : colors.text}>{label}</Text>
        </Block>
      </Button>
    );
  };

  return (
    <Block safe flex={1} color={colors.background} paddingHorizontal={sizes.padding}>
      {/* Header */}
      <Block
        row
        flex={0}
        align="center"
        justify="space-between"
        paddingVertical={sizes.s}
        marginBottom={sizes.sm}
      >
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
        <Text h5 semibold>Report Misconduct</Text>
        <Block width={40} />
      </Block>

      {/* Category */}
      <Block marginBottom={sizes.s}>
        <Text p semibold marginBottom={sizes.s}>Category</Text>
        <Block row wrap="wrap">
          {CATEGORIES.map((c) => (
            <CategoryPill key={c} label={c} />
          ))}
        </Block>
        {errors.category?.message ? (
          <Text size={12} color={colors.danger} marginTop={6}>{errors.category.message}</Text>
        ) : null}
      </Block>

      {/* Reported User (optional) */}
      <Controller
        control={control}
        name="reported_user_id"
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <Input
            placeholder="Reported user ID (optional)"
            autoCapitalize="none"
            autoCorrect={false}
            marginBottom={sizes.s}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            ref={ref}
          />
        )}
      />

      {/* Details */}
      <Controller
        control={control}
        name="details"
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <Input
            placeholder="Describe what happened…"
            autoCapitalize="sentences"
            autoCorrect
            marginBottom={sizes.s}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            ref={ref}
            multiline
            numberOfLines={5}
            error={errors.details?.message}
            success={dirtyFields.details && !errors.details}
          />
        )}
      />

      {/* Contact OK (optional simple toggle as a text button) */}
      <Controller
        control={control}
        name="contact_ok"
        render={({ field: { value, onChange } }) => (
          <Button onPress={() => onChange(!value)}>
            <Text p color={colors.link}>
              {value ? "✓" : "○"} Allow support to contact me about this report
            </Text>
          </Button>
        )}
      />

      {/* Submit */}
      <Button
        color={colors.primary}
        marginTop={sizes.m}
        disabled={submitting}
        onPress={handleSubmit(onSubmit)}
      >
        <Text white semibold>{submitting ? "Submitting…" : "Submit Report"}</Text>
      </Button>

      <Text size={12} color={colors.gray} marginTop={sizes.s}>
        Your report will be reviewed. For urgent safety concerns, contact local authorities.
      </Text>
    </Block>
  );
}
