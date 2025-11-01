import { router } from "expo-router";
import React, { useEffect, useState } from "react";

import { Block, Button, Text, Image } from "@/components";
import { useData, useToast } from "@/hooks";
import { supabase } from "@/utils/supabase";

type VerifState = {
  email?: string | null;
  emailConfirmedAt?: string | null;
  phone?: string | null;
  phoneVerifiedAt?: string | null; // if you store this in metadata
};

export default function VerificationStatus() {
  const { theme } = useData();
  const { show } = useToast();
  const { colors, sizes, assets } = theme;

  const [state, setState] = useState<VerifState>({});
  const [sending, setSending] = useState(false);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) return;

      const u = data.user;
      const meta = (u.user_metadata as any) || {};
      setState({
        email: u.email,
        emailConfirmedAt: (u as any).email_confirmed_at || null, // supabase-js v2 exposes this
        phone: meta?.contact?.phone ?? meta?.phone ?? null,
        phoneVerifiedAt: meta?.phone_verified_at ?? null,        // your app can set this when you verify phone
      });
    })();
  }, []);

  const emailVerified = !!state.emailConfirmedAt;
  const phoneVerified = !!state.phoneVerifiedAt;

  const resendEmail = async () => {
    if (!state.email) return;
    try {
      setSending(true);
      // Supabase: resend confirmation (v2)
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: state.email,
      });
      setSending(false);
      if (error) {
        show("error", error.message);
        return;
      }
      show("success", "Verification email sent");
    } catch (e: any) {
      setSending(false);
      show("error", e?.message || "Failed to send email");
    }
  };

  const Row = ({
    label,
    value,
    verified,
    help,
    cta,
  }: {
    label: string;
    value?: string | null;
    verified: boolean;
    help?: string;
    cta?: React.ReactNode;
  }) => (
    <Block paddingVertical={sizes.sm}>
      <Block row align="center" justify="space-between">
        <Block>
          <Text p semibold>{label}</Text>
          {value ? <Text size={12} color={colors.gray}>{value}</Text> : null}
          {help ? <Text size={12} color={colors.gray}>{help}</Text> : null}
        </Block>
        <Block row align="center">
          <Text p semibold color={verified ? colors.success : colors.danger}>
            {verified ? "Verified" : "Unverified"}
          </Text>
          {!verified ? <Block width={sizes.s} /> : null}
          {cta}
        </Block>
      </Block>
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
        <Text h5 semibold>Verification Status</Text>
        <Block width={40} />
      </Block>

      {/* Items */}
      <Block paddingHorizontal={sizes.md}>
        <Row
          label="Email"
          value={state.email || ""}
          verified={emailVerified}
          help={!emailVerified ? "Verify your email to secure your account and enable all features." : undefined}
          cta={
            !emailVerified ? (
              <Button onPress={resendEmail} disabled={sending}>
                <Text p semibold color={colors.link}>{sending ? "Sending…" : "Resend email"}</Text>
              </Button>
            ) : undefined
          }
        />

        <Block height={1} color="rgba(0,0,0,0.08)" />

        <Row
          label="Phone"
          value={state.phone || "Not added"}
          verified={phoneVerified}
          help={!phoneVerified ? "Add and verify your phone number in Email & Phone." : undefined}
          cta={
            !phoneVerified ? (
              <Button onPress={() => router.push("/profile/settings/contact")}>
                <Text p semibold color={colors.link}>Update</Text>
              </Button>
            ) : undefined
          }
        />
      </Block>
    </Block>
  );
}
