import { Ionicons } from "@expo/vector-icons";
import { Link, Tabs } from "expo-router";

import { useTheme } from "../theme/useTheme";
import { Text } from "react-native";

export default function AuthLayout() {
  const theme = useTheme();

  return (
    <>
    <Link href="/" asChild>
      <Text style={{ padding: 20 }}>Login Flow</Text>
    </Link>
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
        },
        tabBarActiveTintColor: theme.highlight,
        tabBarInactiveTintColor: theme.muted,
        headerStyle: {
          backgroundColor: theme.card,
        },
        headerTintColor: theme.text,
      }}
    >
      <Tabs.Screen 
        name="home" 
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen 
        name="chat" 
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen 
        name="preferences" 
        options={{
          title: 'Preferences',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen 
        name="profile" 
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
      </Tabs>
    </>
  );
}
