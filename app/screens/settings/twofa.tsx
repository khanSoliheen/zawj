import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Block, Button, Text, Image, Input } from "@/components";
import { useData, useToast } from "@/hooks";
import { supabase } from "@/utils/supabase";

/**
 * This screen uses Supabase MFA (TOTP).
 * Flow:
 * 1) List factors. If no verified TOTP, let user enroll.
 * 2) On enroll, Supabase returns an otpauth URI and secret.
 * 3) User scans/adds it to an authenticator app, enters the 6-digit code.
 * 4) Verify to activate. You can unenroll later.
 */

type Factor = {
  id: string;
  factor_type: "totp" | "webauthn";
  status: "verified" | "unverified";
  friendly_name?: string | null;
};

const schema = z.object({
  code: z
    .string()
    .trim()
    .min(6, "Enter the 6-digit code")
    .max(10, "Code looks too long"),
});
type FormValues = z.infer<typeof schema>;

export default function TwoFactorSettings() {
  const { theme } = useData();
  const { show } = useToast();
  const { colors, sizes, assets } = theme;

  const [loading, setLoading] = useState(true);
  const [factors, setFactors] = useState<Factor[]>([]);
  const [enrolling, setEnrolling] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [unenrolling, setUnenrolling] = useState<string | null>(null);

  // Enroll session
  const [pendingFactorId, setPendingFactorId] = useState<string | null>(null);
  const [otpAuthUri, setOtpAuthUri] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields },
  } = useForm<FormValues>({
    resolver: zodResolver(schema as any),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: { code: "" },
  });

  // Load current factors
  const refresh = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.mfa.listFactors();
    setLoading(false);
    if (error) {
      show("error", error.message);
      return;
    }
    const list: Factor[] = [
      ...(data?.all ?? []),
    ] as any; // supabase-js returns { all, totp, webauthn }
    setFactors(list.filter((f) => f.factor_type === "totp"));
  }, [show]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const hasVerifiedTotp = factors.some((f) => f.factor_type === "totp" && f.status === "verified");

  // Start enrollment — get TOTP secret & otpauth URI
  const onEnroll = async () => {
    setEnrolling(true);
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        // Optional:
        // issuer: "Zawj",
        // friendlyName: "My Phone",
      } as any);
      setEnrolling(false);
      if (error) {
        show("error", error.message);
        return;
      }
      // data: { id, type, status, totp: { qr_code, secret, uri } }
      setPendingFactorId((data as any)?.id ?? null);
      setOtpAuthUri((data as any)?.totp?.uri ?? null);
      setSecret((data as any)?.totp?.secret ?? null);
      reset({ code: "" });
      show("success", "TOTP setup created. Add it to your authenticator.");
    } catch (e: any) {
      setEnrolling(false);
      show("error", e?.message || "Failed to start enrollment");
    }
  };

  // Verify the 6-digit code from user's authenticator
  const onVerify = async ({ code }: FormValues) => {
    if (!pendingFactorId) {
      show("error", "No pending setup to verify.");
      return;
    }
    setVerifying(true);
    try {
      const { error } = await supabase.auth.mfa.verify({
        factorId: pendingFactorId,
        code,
      } as any);
      setVerifying(false);
      if (error) {
        show("error", error.message);
        return;
      }
      // Clear pending
      setPendingFactorId(null);
      setOtpAuthUri(null);
      setSecret(null);
      reset({ code: "" });

      show("success", "Two-step verification enabled");
      await refresh();
    } catch (e: any) {
      setVerifying(false);
      show("error", e?.message || "Verification failed");
    }
  };

  // Disable (unenroll) a factor
  const onUnenroll = async (factorId: string) => {
    setUnenrolling(factorId);
    try {
      const { error } = await supabase.auth.mfa.unenroll({ factorId } as any);
      setUnenrolling(null);
      if (error) {
        show("error", error.message);
        return;
      }
      show("success", "Two-step verification disabled");
      await refresh();
    } catch (e: any) {
      setUnenrolling(null);
      show("error", e?.message || "Failed to disable");
    }
  };

  // UI bits
  const Row = ({ left, right }: { left: React.ReactNode; right?: React.ReactNode }) => (
    <Block row justify="space-between" align="center" paddingVertical={sizes.sm}>
      <Block>{left}</Block>
      <Block>{right}</Block>
    </Block>
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
        <Text h5 semibold>Two-Step Verification</Text>
        <Block width={40} />
      </Block>

      {loading ? (
        <Text p color={colors.gray}>Loading…</Text>
      ) : (
        <Block paddingHorizontal={sizes.md}>
          {/* Current status */}
          <Row
            left={
              <>
                <Text p semibold>Status</Text>
                <Text size={12} color={colors.gray}>
                  {hasVerifiedTotp ? "Enabled (Authenticator app)" : "Disabled"}
                </Text>
              </>
            }
            right={
              hasVerifiedTotp ? undefined : (
                <Button onPress={onEnroll} disabled={enrolling}>
                  <Text p semibold color={colors.link}>
                    {enrolling ? "Preparing…" : "Set up"}
                  </Text>
                </Button>
              )
            }
          />

          {/* Existing factors list */}
          {factors.length > 0 && (
            <Block marginTop={sizes.s}>
              {factors.map((f) => (
                <Row
                  key={f.id}
                  left={
                    <>
                      <Text p semibold>Authenticator</Text>
                      <Text size={12} color={colors.gray}>
                        {f.status === "verified" ? "Verified" : "Unverified"}
                      </Text>
                    </>
                  }
                  right={
                    <Button onPress={() => onUnenroll(f.id)} disabled={unenrolling === f.id}>
                      <Text p semibold color={colors.danger}>
                        {unenrolling === f.id ? "Removing…" : "Disable"}
                      </Text>
                    </Button>
                  }
                />
              ))}
            </Block>
          )}

          {/* Enrollment step: show secret/URI + code input */}
          {pendingFactorId && (
            <Block marginTop={sizes.m}>
              <Text p semibold marginBottom={sizes.s}>Finish setup</Text>
              <Text size={12} color={colors.gray} marginBottom={sizes.s}>
                Open your authenticator app (Google Authenticator, 1Password, Authy, etc.) and add a new account using the secret below or the otpauth URI.
              </Text>

              {secret ? (
                <>
                  <Text p color={colors.gray}>Secret</Text>
                  <Text p selectable marginBottom={sizes.s}>{secret}</Text>
                </>
              ) : null}

              {otpAuthUri ? (
                <>
                  <Text p color={colors.gray}>otpauth:// URI</Text>
                  <Text p selectable marginBottom={sizes.s}>{otpAuthUri}</Text>
                </>
              ) : null}

              <Controller
                control={control}
                name="code"
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <Input
                    placeholder="Enter 6-digit code"
                    keyboardType="number-pad"
                    autoCapitalize="none"
                    autoCorrect={false}
                    marginBottom={sizes.s}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    ref={ref}
                    error={errors.code?.message}
                    success={dirtyFields.code && !errors.code}
                  />
                )}
              />

              <Button color={colors.primary} onPress={handleSubmit(onVerify)} disabled={verifying}>
                <Text white semibold>{verifying ? "Verifying…" : "Verify & enable"}</Text>
              </Button>
            </Block>
          )}

          <Block marginTop={sizes.m}>
            <Text size={12} color={colors.gray}>
              After enabling, you’ll need a code from your authenticator app when signing in on new devices.
            </Text>
          </Block>
        </Block>
      )}
    </Block>
  );
}
