import { router } from "expo-router";
import React, { useEffect, useState } from "react";

import { Block, Button, Text, Image } from "@/components";
import { useData, useToast } from "@/hooks";
import { supabase } from "@/utils/supabase";

type SessInfo = {
  userEmail?: string | null;
  createdAt?: string | null;
  expiresAt?: string | null;
};

export default function SessionsSettings() {
  const { theme } = useData();
  const { show } = useToast();
  const { colors, sizes, assets } = theme;

  const [info, setInfo] = useState<SessInfo>({});
  const [working, setWorking] = useState<"others" | "all" | null>(null);

  useEffect(() => {
    (async () => {
      const [{ data: sessionData }, { data: userData }] = await Promise.all([
        supabase.auth.getSession(),
        supabase.auth.getUser(),
      ]);
      const s = sessionData?.session;
      setInfo({
        userEmail: userData?.user?.email ?? null,
        // createdAt: s?.created_at ?? null,
        expiresAt: s?.expires_at ? new Date(s.expires_at * 1000).toISOString() : null,
      });
    })();
  }, []);

  const signOutOthers = async () => {
    setWorking("others");
    try {
      // Supabase v2 supports scope: 'others' to revoke all sessions except current
      const { error } = await supabase.auth.signOut({ scope: "others" as any });
      if (error) throw error;
      show("success", "Signed out of other devices");
    } catch (e: any) {
      show("error", e?.message || "Failed to sign out of other devices");
    } finally {
      setWorking(null);
    }
  };

  const signOutAll = async () => {
    setWorking("all");
    try {
      // 'global' signs out this device too
      const { error } = await supabase.auth.signOut({ scope: "global" as any });
      if (error) throw error;
      show("success", "Signed out everywhere");
      router.replace("/login");
    } catch (e: any) {
      show("error", e?.message || "Failed to sign out everywhere");
    } finally {
      setWorking(null);
    }
  };

  const Row = ({ label, value }: { label: string; value?: string | null }) => (
    <Block paddingVertical={sizes.xs}>
      <Text size={12} color={colors.gray}>{label}</Text>
      <Text p>{value || "—"}</Text>
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
        <Text h5 semibold>Devices & Sessions</Text>
        <Block width={40} />
      </Block>

      {/* Current session info */}
      <Block paddingHorizontal={sizes.md}>
        <Row label="Signed in as" value={info.userEmail} />
        <Row label="Session created" value={info.createdAt} />
        <Row label="Session expires" value={info.expiresAt} />

        <Block marginTop={sizes.m}>
          <Button onPress={signOutOthers} disabled={working !== null}>
            <Text p semibold color={colors.link}>
              {working === "others" ? "Signing out…" : "Sign out of other devices"}
            </Text>
          </Button>

          <Button onPress={signOutAll} disabled={working !== null} marginTop={sizes.s}>
            <Text p semibold color={colors.danger}>
              {working === "all" ? "Signing out…" : "Sign out of all devices"}
            </Text>
          </Button>

          <Text size={12} color={colors.gray} marginTop={sizes.s}>
            Use this if you lost a phone or signed in on a shared device.
          </Text>
        </Block>
      </Block>
    </Block>
  );
}
