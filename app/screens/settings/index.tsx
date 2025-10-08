import { router } from "expo-router";
import React from "react";

import { showToaster } from "@/common/commonUtils";
import { Block, Button, Text, Image, Switch } from "@/components";
import { useData } from "@/hooks";
import { supabase } from "@/utils/supabase";

export default function Settings() {
  const { isDark, handleIsDark, theme } = useData();
  const { colors, sizes, assets } = theme;

  const logoutHandler = async () => {
    await supabase.auth.signOut();
    showToaster("Logout Successful");
    router.replace("/login");
  };

  const SectionHeader = ({ title }: { title: string }) => (
    <Text h6 semibold marginTop={sizes.m} marginBottom={sizes.s} color={colors.text}>
      {title}
    </Text>
  );

  const Arrow = () => (
    <Image
      radius={0}
      width={10}
      height={18}
      color={colors.gray}
      source={assets.arrow}
    />
  );

  const SettingItem = ({ label, onPress, danger }: any) => (
    <Button
      row
      justify="space-between"
      align="center"
      paddingVertical={sizes.sm}
      onPress={onPress}
    >
      <Text p color={danger ? colors.danger : colors.text}>
        {label}
      </Text>
      {!danger && <Arrow />}
    </Button>
  );

  return (
    <Block safe flex={1} color={colors.background} paddingHorizontal={sizes.padding}>
      {/* Header */}
      <Block
        flex={0}
        row
        align="center"
        justify="space-between"
        marginBottom={sizes.sm}
        paddingVertical={sizes.s}
      >
        <Button onPress={() => router.back()}>
          <Image
            radius={0}
            width={10}
            height={18}
            color={colors.text}
            source={assets.arrow}
            transform={[{ rotate: "180deg" }]}
          />
        </Button>
        <Text h5 semibold>
          Settings
        </Text>
        <Block width={24} />
      </Block>

      {/* Settings list */}
      <Block scroll paddingHorizontal={sizes.md} showsVerticalScrollIndicator={false}>
        {/* 🧍 Account Settings */}
        <SectionHeader title="Account Settings" />
        <SettingItem label="Edit Profile" onPress={() => router.push("/screens/edit")} />
        <SettingItem label="Change Password" onPress={() => router.push("/screens/settings/change-password")} />
        <SettingItem label="Email & Phone" onPress={() => router.push("/screens/settings/contact")} />
        {/*<SettingItem label="Verification Status" onPress={() => alert("Verification Status")} />*/}
        <SettingItem label="Profile Visibility" onPress={() => alert("Profile Visibility")} />

        {/* ❤️ Preferences */}
        <SectionHeader title="Match & Preferences" />
        <SettingItem label="Match Preferences" onPress={() => router.push("/preferences")} />
        <SettingItem label="Notifications" onPress={() => router.push("/screens/settings/notifications")} />
        <SettingItem label="Language" onPress={() => alert("Language Settings")} />
        <Block
          row
          justify="space-between"
          align="center"
          paddingVertical={sizes.sm}
        >
          <Text p>Dark Mode</Text>
          <Switch
            id="darkModeToggle"
            inactiveFillColor={colors.secondary}
            checked={isDark}
            onPress={(checked) => handleIsDark(checked)}
          />
        </Block>

        {/* 🔒 Privacy & Security */}
        <SectionHeader title="Privacy & Security" />
        <SettingItem label="Verification" onPress={() => router.push("/screens/settings/verification")} />
        <SettingItem label="Two-Step Verification" onPress={() => router.push("/screens/settings/twofa")} />
        <SettingItem label="Blocked Users" onPress={() => router.push("/screens/settings/blocked-users")} />
        <SettingItem label="Delete Account" onPress={() => router.push("/screens/settings/delete-account")} danger />

        {/* 🕌 Faith & Community */}
        <SectionHeader title="Faith & Community" />
        <SettingItem label="Islamic Policy" onPress={() => router.push("/screens/settings/policy")} />
        <SettingItem label="Report Misconduct" onPress={() => router.push("screens/settings/report")} />
        <SettingItem label="Daily Islamic Reminder" onPress={() => router.push("profile/settings/reminders")} />

        {/* 🚪 Logout */}
        {/*<SectionHeader title="Logout" />*/}
        <SettingItem label="Log out" danger onPress={logoutHandler} />

        <Block height={sizes.l} />
      </Block>
    </Block>
  );
}
