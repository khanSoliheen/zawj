import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";

import { Block, Button, Text, Image } from "@/components";
import { useData, useToast } from "@/hooks";
import { supabase } from "@/utils/supabase";

type BlockRow = {
  blocked_user_id: string;
  created_at?: string;
};

type Profile = {
  id: string;
  full_name?: string | null;
  avatar_url?: string | null;
  handle?: string | null;
};

export default function BlockedUsers() {
  const { theme } = useData();
  const { show } = useToast();
  const { colors, sizes, assets } = theme;

  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<BlockRow[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [me, setMe] = useState<string | null>(null);

  const blockedIds = useMemo(() => rows.map(r => r.blocked_user_id), [rows]);
  const items = useMemo(() => blockedIds.map(id => profiles[id]).filter(Boolean) as Profile[], [blockedIds, profiles]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: userRes, error: userErr } = await supabase.auth.getUser();
      if (userErr || !userRes?.user) {
        setLoading(false);
        return;
      }
      const userId = userRes.user.id;
      setMe(userId);

      // 1) blocked rows
      const { data: blocked, error: blockedErr } = await supabase
        .from("blocked_users")
        .select("blocked_user_id, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (blockedErr) {
        show("error", blockedErr.message);
        setLoading(false);
        return;
      }
      setRows(blocked || []);

      // 2) fetch their profiles in one go
      const ids = (blocked || []).map(b => b.blocked_user_id);
      if (ids.length === 0) {
        setLoading(false);
        return;
      }

      const { data: profs, error: profErr } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, handle")
        .in("id", ids);

      if (profErr) {
        show("error", profErr.message);
        setLoading(false);
        return;
      }

      const map: Record<string, Profile> = {};
      (profs || []).forEach(p => { map[p.id] = p; });
      setProfiles(map);
      setLoading(false);
    })();
  }, [show]);

  const onUnblock = async (blockedId: string) => {
    if (!me) return;
    // optimistic update
    const prevRows = rows;
    setRows(prev => prev.filter(r => r.blocked_user_id !== blockedId));
    try {
      const { error } = await supabase
        .from("blocked_users")
        .delete()
        .eq("user_id", me)
        .eq("blocked_user_id", blockedId);
      if (error) throw error;
      show("success", "User unblocked");
    } catch (e: any) {
      // revert on failure
      setRows(prevRows);
      show("error", e?.message || "Failed to unblock");
    }
  };

  const Row = ({ p }: { p: Profile }) => (
    <Block row align="center" justify="space-between" paddingVertical={sizes.sm}>
      <Block row align="center">
        <Image
          radius={8}
          width={36}
          height={36}
          source={p.avatar_url ? { uri: p.avatar_url } : assets.avatar1}
        />
        <Block marginLeft={sizes.s}>
          <Text p semibold>{p.full_name || p.handle || "User"}</Text>
          {p.handle ? <Text size={12} color={colors.gray}>@{p.handle}</Text> : null}
        </Block>
      </Block>
      <Button onPress={() => onUnblock(p.id)}>
        <Text p semibold color={colors.danger}>Unblock</Text>
      </Button>
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
        <Text h5 semibold>Blocked Users</Text>
        <Block width={40} />
      </Block>

      {/* Body */}
      {loading ? (
        <Text p color={colors.gray}>Loading…</Text>
      ) : items.length === 0 ? (
        <Text p color={colors.gray}>You haven’t blocked anyone.</Text>
      ) : (
        <Block paddingHorizontal={sizes.md}>
          {items.map((p) => (
            <Row key={p.id} p={p} />
          ))}
        </Block>
      )}
    </Block>
  );
}
