// app/(screens)/users/[id]/block.tsx
import { useLocalSearchParams, router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";

import { Block, Button, Text, Image } from "@/components";
import { useAuth, useData, useToast } from "@/hooks";
import { supabase } from "@/utils/supabase";

type Profile = {
  id: string;
  full_name?: string | null;
  avatar_url?: string | null;
  handle?: string | null;
};

export default function BlockUserScreen() {
  const { theme } = useData();
  const { show } = useToast();
  const { currentUser } = useAuth();
  const { colors, sizes, assets } = theme;

  // Route param from /users/[id] (or /users/[id]?user_id=...)
  const { id, user_id } = useLocalSearchParams<{ id?: string; user_id?: string }>();
  const targetId = (user_id ?? id ?? "").trim();
  const currentUserId = currentUser?.id ?? null;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [isBlocked, setIsBlocked] = useState<boolean | null>(null);
  const [working, setWorking] = useState(false);

  const selfView = useMemo(
    () => !!currentUserId && !!targetId && currentUserId === targetId,
    [currentUserId, targetId]
  );

  // Load target profile (optional context)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!targetId) return;
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, handle")
        .eq("id", targetId)
        .maybeSingle();
      if (!cancelled) {
        if (error) show("error", error.message);
        setProfile(data ?? null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [targetId, show]);

  // Load whether target is already blocked
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!currentUserId || !targetId || selfView) {
        if (!cancelled) setIsBlocked(false);
        return;
      }
      const { data: row, error } = await supabase
        .from("blocked_users")
        .select("user_id, blocked_user_id")
        .eq("user_id", currentUserId)
        .eq("blocked_user_id", targetId)
        .maybeSingle();
      if (!cancelled) {
        if (error) show("error", error.message);
        setIsBlocked(!error && !!row);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [currentUserId, targetId, selfView, show]);

  /** Actions */
  const doBlock = async () => {
    if (!targetId) return show("error", "Missing user id.");
    if (!currentUserId) return show("error", "Please sign in to block users.");
    if (selfView || isBlocked === true || working) return;

    setWorking(true);
    try {
      const { error } = await supabase
        .from("blocked_users")
        .insert({ user_id: currentUserId, blocked_user_id: targetId });
      if (error && !/duplicate|unique/i.test(error.message)) throw error;

      setIsBlocked(true);
      show("success", "User blocked");
    } catch (e: any) {
      show("error", e?.message || "Failed to block user");
    } finally {
      setWorking(false);
    }
  };

  const doUnblock = async () => {
    if (!targetId || !currentUserId || working) return;
    setWorking(true);
    try {
      const { error } = await supabase
        .from("blocked_users")
        .delete()
        .eq("user_id", currentUserId)
        .eq("blocked_user_id", targetId);
      if (error) throw error;

      setIsBlocked(false);
      show("success", "User unblocked");
    } catch (e: any) {
      show("error", e?.message || "Failed to unblock user");
    } finally {
      setWorking(false);
    }
  };

  /** Confirmations */
  const confirmBlock = () => {
    Alert.alert(
      "Block this user?",
      "They won’t be able to view your profile or contact you.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Block", style: "destructive", onPress: doBlock },
      ]
    );
  };

  const confirmUnblock = () => {
    Alert.alert(
      "Unblock user?",
      "They will be able to view your profile and contact you again.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Unblock", style: "destructive", onPress: doUnblock },
      ]
    );
  };

  /** UI */
  const Header = () => (
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
      <Text h5 semibold>Block User</Text>
      <Block width={40} />
    </Block>
  );

  return (
    <Block safe flex={1} color={colors.background} paddingHorizontal={sizes.padding}>
      <Header />

      {/* Body (mirrors Delete Account: vertical flow, clear spacing) */}
      <Block>
        {!targetId ? (
          <Text p color={colors.gray}>No user selected.</Text>
        ) : selfView ? (
          <Text p color={colors.gray}>You can’t block your own account.</Text>
        ) : (
          <>
            {/* Profile row (optional) */}
            {profile && (
              <Block row align="center" paddingVertical={sizes.sm} marginBottom={sizes.s}>
                <Image
                  radius={8}
                  width={48}
                  height={48}
                  source={profile.avatar_url ? { uri: profile.avatar_url } : assets.avatar1}
                />
                <Block marginLeft={sizes.s}>
                  <Text p semibold>{profile.full_name || profile.handle || "User"}</Text>
                  {profile.handle ? (
                    <Text size={12} color={colors.gray}>@{profile.handle}</Text>
                  ) : null}
                </Block>
              </Block>
            )}

            {/* Info */}
            <Text p color={colors.danger} semibold marginBottom={sizes.s}>
              This affects how you and this user interact.
            </Text>
            <Text p marginBottom={sizes.s}>
              When you block someone:
            </Text>
            <Text size={12} color={colors.gray}>• They can’t message or call you.</Text>
            <Text size={12} color={colors.gray}>• They won’t see your profile or activity.</Text>
            <Text size={12} color={colors.gray} marginBottom={sizes.s}>
              • You won’t appear in their matches or searches.
            </Text>

            <Text p marginBottom={sizes.s}>
              What doesn’t change:
            </Text>
            <Text size={12} color={colors.gray}>• Existing chat history on your device remains.</Text>
            <Text size={12} color={colors.gray} marginBottom={sizes.m}>
              • Blocking doesn’t submit a report to support.
            </Text>

            {/* Primary action (same pattern as Delete Account button content) */}
            <Button
              color={colors.primary}
              marginTop={sizes.s}
              disabled={working || isBlocked === null}
              onPress={() => {
                if (working || isBlocked === null) return;
                isBlocked ? confirmUnblock() : confirmBlock();
              }}
            >
              <Block row align="center" paddingVertical={sizes.s}>
                {/*<Image
                  radius={0}
                  width={18}
                  height={18}
                  source={assets.rental}
                  color={colors.white}
                />*/}
                <Text white semibold marginLeft={sizes.s}>
                  {working ? "Please wait…" : isBlocked ? "Unblock user" : "Block user"}
                </Text>
              </Block>
            </Button>

            {/* Secondary actions */}
            <Button marginTop={sizes.s} onPress={() => router.push(`/users/${targetId}`)}>
              <Text p color={colors.link}>View profile</Text>
            </Button>
            <Button
              marginTop={sizes.s}
              onPress={() =>
                router.push({
                  pathname: `/screens/settings/report/${user_id}`,
                  params: { reported_user_id: targetId, context: "Profile" },
                })
              }
            >
              <Text p color={colors.link}>Report user</Text>
            </Button>

            {/* Safety note */}
            <Text size={12} color={colors.gray} marginTop={sizes.m}>
              For urgent safety concerns, contact local authorities first.
            </Text>
          </>
        )}
      </Block>
    </Block>
  );
}
