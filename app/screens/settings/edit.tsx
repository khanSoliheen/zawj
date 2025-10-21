import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Block, Button, Text, Image, Input } from "@/components";
import { useData, useToast } from "@/hooks";
import { supabase } from "@/utils/supabase";

const schema = z.object({
  full_name: z.string().trim().min(2, "Enter your name"),
  bio: z.string().trim().max(300, "Max 300 characters").optional().or(z.literal("")),
  location: z.string().trim().max(120).optional().or(z.literal("")),
  profession: z.string().trim().max(120).optional().or(z.literal("")),
});
type FormValues = z.infer<typeof schema>;

export default function EditProfile() {
  const { theme } = useData();
  const { show } = useToast();
  const { colors, sizes, assets } = theme;

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema as any),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: { full_name: "", bio: "", location: "", profession: "" },
  });

  // Load current profile
  useEffect(() => {
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      const userId = auth?.user?.id;
      if (!userId) return;

      const { data: prof } = await supabase
        .from("profiles")
        .select("full_name, bio, location, profession, avatar_url")
        .eq("id", userId)
        .maybeSingle();

      reset({
        full_name: prof?.full_name ?? "",
        bio: prof?.bio ?? "",
        location: prof?.location ?? "",
        profession: prof?.profession ?? "",
      });
      setAvatarUrl(prof?.avatar_url ?? null);
    })();
  }, [reset]);

  const pickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      show("error", "Permission to access photos is required.");
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
      aspect: [1, 1],
    });
    if (res.canceled) return;
    const file = res.assets[0];
    await uploadAvatar(file.uri);
  };

  const uploadAvatar = async (uri: string) => {
    try {
      setUploading(true);
      const { data: auth } = await supabase.auth.getUser();
      const userId = auth?.user?.id!;
      const ext = uri.split(".").pop() || "jpg";
      const path = `avatars/${userId}_${Date.now()}.${ext}`;

      const resp = await fetch(uri);
      const blob = await resp.blob();

      // Upload to storage bucket "avatars"
      const { error: upErr } = await supabase.storage.from("avatars").upload(path, blob, {
        contentType: blob.type || "image/jpeg",
        upsert: true,
      });
      if (upErr) throw upErr;

      // Get a public URL (or use RLS-signed URLs if you prefer)
      const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
      const publicUrl = pub.publicUrl;

      // Save to profile row
      const { error: profErr } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", userId);
      if (profErr) throw profErr;

      setAvatarUrl(publicUrl);
      show("success", "Photo updated");
    } catch (e: any) {
      show("error", e?.message || "Failed to upload");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    const { data: auth } = await supabase.auth.getUser();
    const userId = auth?.user?.id;
    if (!userId) {
      show("error", "Not signed in");
      return;
    }
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: userId, ...values }, { onConflict: "id" });
    if (error) {
      show("error", error.message);
      return;
    }
    show("success", "Profile saved");
    router.back();
  };

  const Field = ({
    name,
    placeholder,
    multiline = false,
  }: {
    name: keyof FormValues;
    placeholder: string;
    multiline?: boolean;
  }) => (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value, ref } }) => (
        <Input
          placeholder={placeholder}
          autoCapitalize={name === "full_name" ? "words" : "sentences"}
          autoCorrect
          marginBottom={sizes.s}
          value={value as any}
          onChangeText={onChange}
          onBlur={onBlur}
          ref={ref}
          multiline={multiline}
          numberOfLines={multiline ? 4 : 1}
          error={(errors as any)[name]?.message}
          success={(dirtyFields as any)[name] && !(errors as any)[name]}
        />
      )}
    />
  );

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
        <Text h5 semibold>Edit Profile</Text>
        <Block width={40} />
      </Block>

      {/* Avatar */}
      <Block row align="center" marginBottom={sizes.m}>
        <Image
          radius={8}
          width={64}
          height={64}
          source={avatarUrl ? { uri: avatarUrl } : assets.avatar1}
        />
        <Button onPress={pickAvatar}>
          <Text p semibold color={colors.link} marginLeft={sizes.s}>
            {uploading ? "Uploading…" : "Change photo"}
          </Text>
        </Button>
      </Block>

      {/* Form */}
      <Field name="full_name" placeholder="Full name" />
      <Field name="profession" placeholder="Profession (optional)" />
      <Field name="location" placeholder="Location (optional)" />
      <Field name="bio" placeholder="Bio (max 300 chars)" multiline />

      <Button
        color={colors.primary}
        marginTop={sizes.s}
        disabled={isSubmitting}
        onPress={handleSubmit(onSubmit)}
      >
        <Text white semibold>{isSubmitting ? "Saving…" : "Save"}</Text>
      </Button>
    </Block>
  );
}
