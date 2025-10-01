import { Tabs } from "expo-router";

import { Image } from "@/components";
import { useData } from "@/hooks";

// import { Ionicons } from "@expo/vector-icons";
export default function AuthLayout() {
  const { theme } = useData();
  const { assets, colors } = theme;
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="home" options={{
        tabBarIcon: () => {
          return <Image source={assets.home} color={colors.gray} />
        }
      }} />
      <Tabs.Screen name="chat" options={{
        tabBarIcon: () => {
          return <Image source={assets.chat} color={colors.gray} />
        },
        title: 'Chat'
      }} />
      <Tabs.Screen name="preferences" options={{
        tabBarIcon: () => {
          return <Image source={assets.extras} color={colors.gray} />
        },
      }} />
      <Tabs.Screen name="profile" options={{
        tabBarIcon: () => {
          return <Image source={assets.profile} color={colors.gray} />
        },
        title: 'Profile'
      }} />
      <Tabs.Screen
        name="chat/[id]"
        options={{
          href: null, // ❌ remove from tab bar
        }}
      />
      {/*<Tabs.Screen name="Settings" options={{
        tabBarIcon: ({ focused }) => {
          return <Image source={assets.settings} color={colors.gray} />
        }
      }} />*/}
    </Tabs>
  )
}
