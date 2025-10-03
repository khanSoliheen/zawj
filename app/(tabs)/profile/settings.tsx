import { router } from "expo-router";

import { showToaster } from "@/common/commonUtils";
import { Block, Button, Text, Image, Switch } from "@/components";
import { useData } from "@/hooks";
import { supabase } from "@/utils/supabase";

export default function Settings() {
  const { isDark, handleIsDark, theme } = useData();
  const { colors, sizes, assets } = theme;

  const logoutHandler = () => {
    router.push("/login");
    supabase.auth.signOut();
    showToaster("Logout Successful");
  };
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
      <Block scroll paddingHorizontal={sizes.md}>
        <Button row justify="space-between" align="center" paddingVertical={sizes.sm} onPress={() => alert("Change Password")}>
          <Text p>Change Password</Text>
          <Image radius={0} width={10} height={18} color={colors.gray} source={assets.arrow} />
        </Button>

        <Button row justify="space-between" align="center" paddingVertical={sizes.sm} onPress={() => alert("Notifications")}>
          <Text p>Notifications</Text>
          <Image radius={0} width={10} height={18} color={colors.gray} source={assets.arrow} />
        </Button>

        <Button row justify="space-between" align="center" paddingVertical={sizes.sm} onPress={() => alert("Privacy & Security")}>
          <Text p>Privacy & Security</Text>
          <Image radius={0} width={10} height={18} color={colors.gray} source={assets.arrow} />
        </Button>

        <Button row justify="space-between" align="center" paddingVertical={sizes.sm} onPress={() => alert("Language")}>
          <Text p>Language</Text>
          <Image radius={0} width={10} height={18} color={colors.gray} source={assets.arrow} />
        </Button>

        {/* Dark Mode Toggle */}
        <Block row justify="space-between" align="center" paddingVertical={sizes.sm}>
          <Text p>Dark Mode</Text>
          <Switch
            id="darkModeToggle"
            inactiveFillColor={colors.secondary}
            checked={isDark}
            onPress={(checked) => {
              handleIsDark(checked);
            }}
          />
        </Block>

        <Button row justify="space-between" align="center" paddingVertical={sizes.sm} onPress={logoutHandler}>
          <Text p color={colors.danger}>
            Log out
          </Text>
        </Button>
      </Block>
    </Block>
  );
}
