import { router } from "expo-router";
import React, { useEffect, useState } from "react";

import { Block, Button, Text, Image, Switch } from "@/components";
import { useData, useToast } from "@/hooks";
import { supabase } from "@/utils/supabase";

type VisibilityPrefs = {
  discoverable: boolean;       // show profile in search/browse
  messages_from: "everyone" | "matches"; // who can DM first
  read_receipts: boolean;      // show “seen” status
};

const DEFAULTS: VisibilityPrefs = {
  discoverable: true,
  messages_from: "matches",
  read_receipts: true,
};

export default function ProfileVisibilitySettings() {
  const { theme } = useData();
  const { show } = useToast();
  const { colors, sizes, assets } = theme;

  const [prefs, setPrefs] = useState<VisibilityPrefs>(DEFAULTS);
  const [saving, setSaving] = useState(false);

  // Load from user metadata
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) return;
      const meta = (data?.user?.user_metadata as any) || {};
      const fromMeta: VisibilityPrefs = {
        discoverable: meta?.privacy?.discoverable ?? DEFAULTS.discoverable,
        messages_from: meta?.privacy?.messages_from ?? DEFAULTS.messages_from,
        read_receipts: meta?.privacy?.read_receipts ?? DEFAULTS.read_receipts,
      };
      setPrefs(fromMeta);
    })();
  }, []);

  const save = async (next: VisibilityPrefs) => {
    if (saving) return;
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ data: { privacy: next } });
    setSaving(false);
    if (error) {
      show("error", error.message);
      return;
    }
    show("success", "Privacy updated");
  };

  const setToggle = (key: keyof VisibilityPrefs) => (checked: boolean) => {
    const next = { ...prefs, [key]: checked as any };
    setPrefs(next);
    void save(next);
  };

  const setMessagesFrom = (value: "everyone" | "matches") => {
    const next = { ...prefs, messages_from: value };
    setPrefs(next);
    void save(next);
  };

  const Row = ({
    label,
    help,
    right,
  }: {
    label: string;
    help?: string;
    right: React.ReactNode;
  }) => (
    <Block row justify="space-between" align="center" paddingVertical={sizes.sm}>
      <Block>
        <Text p semibold>{label}</Text>
        {help ? <Text size={12} color={colors.gray}>{help}</Text> : null}
      </Block>
      {right}
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
        <Text h5 semibold>Profile Visibility</Text>
        <Block width={40} />
      </Block>

      {/* Toggles / Options */}
      <Block paddingHorizontal={sizes.md}>
        <Row
          label="Show my profile in search"
          help="Allow others to discover you in search and explore"
          right={
            <Switch
              id="discoverable-toggle"
              inactiveFillColor={colors.secondary}
              checked={prefs.discoverable}
              onPress={setToggle("discoverable")}
            />
          }
        />

        <Row
          label="Allow messages from"
          help="Who can start a conversation with you"
          right={
            <Block row align="center">
              <Button onPress={() => setMessagesFrom("matches")}>
                <Text p semibold color={prefs.messages_from === "matches" ? colors.primary : colors.text}>
                  Matches
                </Text>
              </Button>
              <Text p color={colors.gray} marginHorizontal={sizes.s}>/</Text>
              <Button onPress={() => setMessagesFrom("everyone")}>
                <Text p semibold color={prefs.messages_from === "everyone" ? colors.primary : colors.text}>
                  Everyone
                </Text>
              </Button>
            </Block>
          }
        />

        <Row
          label="Read receipts"
          help="Let others see when you’ve read their messages"
          right={
            <Switch
              id="read-receipts-toggle"
              inactiveFillColor={colors.secondary}
              checked={prefs.read_receipts}
              onPress={setToggle("read_receipts")}
            />
          }
        />
      </Block>

      {/* Save hint */}
      <Block marginTop={sizes.sm}>
        <Text size={12} color={colors.gray}>
          Changes are saved automatically{saving ? "…" : "."}
        </Text>
      </Block>
    </Block>
  );
}
