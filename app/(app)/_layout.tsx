// import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
export default function AuthLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="home" />
      <Tabs.Screen name="chat" />
      <Tabs.Screen name="preferences" />
      <Tabs.Screen name="profile" />
    </Tabs>
  )
}
