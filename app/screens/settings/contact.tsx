import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Block, Button, Text, Input, Image } from "@/components";
import { useData, useToast } from "@/hooks";
import { supabase } from "@/utils/supabase";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  phone: z
    .string()
    .trim()
    .optional()
    .refine((v) => !v || /^[0-9+\-() ]{6,20}$/.test(v), "Enter a valid phone number"),
  code: z.string().trim().optional(), // required only when verifying
});
type FormValues = z.infer<typeof schema>;

export default function ContactSettings() {
  const { theme } = useData();
  const { show } = useToast();
  const { colors, sizes, assets } = theme;

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, dirtyFields, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema as any),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: { email: "", phone: "", code: "" },
  });

  const email = watch("email");
  const phone = watch("phone");
  const code = watch("code");

  const [initial, setInitial] = useState({ email: "", phone: "" });
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);

  // Inline OTP state
  const [codeSent, setCodeSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const resendTimerRef = useRef<any | null>(null);

  const emailChanged = useMemo(() => !!email && email !== initial.email, [email, initial.email]);
  const phoneChanged = useMemo(() => (phone ?? "") !== (initial.phone ?? ""), [phone, initial.phone]);

  // Load current values & verification flags
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      const u = data?.user;
      const meta = (u?.user_metadata as any) || {};
      const currentPhone = meta?.contact?.phone ?? meta?.phone ?? "";
      reset({ email: u?.email ?? "", phone: currentPhone ?? "", code: "" });
      setInitial({ email: u?.email ?? "", phone: currentPhone ?? "" });
      setEmailVerified(!!(u as any)?.email_confirmed_at);
      setPhoneVerified(!!meta?.phone_verified_at);
    })();
    return () => {
      if (resendTimerRef.current) clearInterval(resendTimerRef.current);
    };
  }, [reset]);

  const startResendCountdown = (secs = 60) => {
    setResendIn(secs);
    if (resendTimerRef.current) clearInterval(resendTimerRef.current);
    resendTimerRef.current = setInterval(() => {
      setResendIn((s) => {
        if (s <= 1) {
          if (resendTimerRef.current) clearInterval(resendTimerRef.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  // 1) Send/Resend OTP for phone (via Supabase)
  const onSendCode = async () => {
    if (!phone || phone.trim().length < 6) {
      show("error", "Enter a valid phone number first");
      return;
    }
    setSending(true);
    try {
      const { error } = await supabase.auth.updateUser({ phone }); // sends SMS OTP if SMS provider enabled
      if (error) {
        console.error(error);
        show("error", error.message);
        setSending(false);
        return;
      }
      // Also keep phone under user_metadata.contact for consistency
      const { data: me } = await supabase.auth.getUser();
      const prevMeta = (me?.user?.user_metadata as any) ?? {};
      await supabase.auth.updateUser({
        data: { ...prevMeta, contact: { ...(prevMeta.contact ?? {}), phone } },
      });

      setCodeSent(true);
      setValue("code", "");
      startResendCountdown(60);
      show("success", "Verification code sent via SMS");
    } catch (e: any) {
      show("error", e?.message || "Failed to send code");
    } finally {
      setSending(false);
    }
  };

  // 2) Verify OTP inline
  const onVerifyCode = async () => {
    if (!phone || !code) {
      show("error", "Enter the code you received");
      return;
    }
    setVerifying(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        type: "phone_change",
        phone,
        token: code,
      });
      if (error) {
        show("error", error.message);
        setVerifying(false);
        return;
      }
      // Optional: stamp local flag
      const { data: me } = await supabase.auth.getUser();
      const prevMeta = (me?.user?.user_metadata as any) ?? {};
      await supabase.auth.updateUser({
        data: {
          ...prevMeta,
          contact: { ...(prevMeta.contact ?? {}), phone },
          phone_verified_at: new Date().toISOString(),
        },
      });

      setPhoneVerified(true);
      setInitial((x) => ({ ...x, phone })); // phone is now the confirmed one
      setCodeSent(false);
      setValue("code", "");
      show("success", "Phone verified");
    } catch (e: any) {
      show("error", e?.message || "Verification failed");
    } finally {
      setVerifying(false);
    }
  };

  // 3) Save button — handles email change (and phone clear)
  const onSave = async ({ email, phone }: FormValues) => {
    // Email change → Supabase sends confirmation email
    if (emailChanged) {
      const { error: emailErr } = await supabase.auth.updateUser({ email });
      if (emailErr) {
        show("error", emailErr.message);
        return;
      }
      show("success", "Check your inbox to confirm the new email");
      setInitial((x) => ({ ...x, email }));
      setEmailVerified(false);
    }

    // Phone cleared (remove)
    if (phoneChanged && (!phone || phone.trim() === "")) {
      const { data: me } = await supabase.auth.getUser();
      const prevMeta = (me?.user?.user_metadata as any) ?? {};
      await supabase.auth.updateUser({
        data: {
          ...prevMeta,
          contact: { ...(prevMeta.contact ?? {}), phone: "" },
          phone_verified_at: null,
        },
      });
      setPhoneVerified(false);
      setInitial((x) => ({ ...x, phone: "" }));
      setCodeSent(false);
      show("success", "Phone removed");
    }

    // If phone changed to a non-empty value, we **don’t** finish save here.
    // The user should press “Send code”, then verify inline.
    if (phoneChanged && phone && phone.trim() !== "") {
      show("success", "Now send a code to verify your new phone.");
    }
  };

  const SaveButtonLabel = () => {
    if (isSubmitting) return "Saving…";
    if (emailChanged || (phoneChanged && (!phone || phone.trim() === ""))) return "Save";
    return "No changes";
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
        <Text h5 semibold>Email & Phone</Text>
        <Block width={40} />
      </Block>

      {/* Status hints */}
      <Block marginBottom={sizes.s}>
        {!emailVerified && initial.email ? (
          <Text size={12} color={colors.gray}>
            Email not verified. After changing email, you’ll receive a confirmation link.
          </Text>
        ) : null}
        {!phoneVerified && initial.phone ? (
          <Text size={12} color={colors.gray}>
            Phone not verified. Send a code and verify below.
          </Text>
        ) : null}
      </Block>

      {/* Email */}
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

      {/* Phone */}
      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <Input
            placeholder="+91 98765 43210"
            keyboardType="phone-pad"
            autoCapitalize="none"
            autoCorrect={false}
            marginBottom={sizes.s}
            value={value ?? ""}
            onChangeText={(t) => {
              onChange(t);
              // Reset OTP UI if user edits phone again
              setCodeSent(false);
              setValue("code", "");
            }}
            onBlur={onBlur}
            ref={ref}
            error={errors.phone?.message}
            success={dirtyFields.phone && !errors.phone}
          />
        )}
      />

      {/* OTP section (inline) */}
      {phone && phone.trim() !== "" ? (
        <Block>
          {!codeSent ? (
            <Button onPress={onSendCode} disabled={sending || (phone === initial.phone && phoneVerified)}>
              <Text p semibold color={colors.link}>
                {sending ? "Sending…" : (phone === initial.phone && phoneVerified) ? "Already verified" : "Send code"}
              </Text>
            </Button>
          ) : (
            <>
              <Controller
                control={control}
                name="code"
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <Input
                    placeholder="Enter 6-digit code"
                    keyboardType="number-pad"
                    autoCapitalize="none"
                    autoCorrect={false}
                    marginTop={sizes.m}
                    marginBottom={sizes.s}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    ref={ref}
                    error={errors.code?.message}
                    success={!!value && !errors.code}
                  />
                )}
              />

              <Button color={colors.primary} onPress={onVerifyCode} disabled={verifying || !code}>
                <Text white semibold>{verifying ? "Verifying…" : "Verify phone"}</Text>
              </Button>

              <Button onPress={onSendCode} marginTop={sizes.s} disabled={sending || resendIn > 0}>
                <Text p semibold color={colors.link}>
                  {resendIn > 0 ? `Resend in ${resendIn}s` : sending ? "Resending…" : "Resend code"}
                </Text>
              </Button>
            </>
          )}
        </Block>
      ) : null}

      {/* Save (for email change or clearing phone) */}
      <Button
        color={colors.primary}
        marginTop={sizes.m}
        disabled={
          isSubmitting ||
          (!emailChanged && !(phoneChanged && (!phone || phone.trim() === "")))
        }
        onPress={handleSubmit(onSave)}
      >
        <Text white semibold>{<SaveButtonLabel />}</Text>
      </Button>

      <Block marginTop={sizes.s}>
        <Button onPress={() => router.push("/settings/verification")}>
          <Text p semibold color={colors.link}>Verification status</Text>
        </Button>
      </Block>
    </Block>
  );
}
