// import React, { useEffect, useMemo, useState } from "react";
// import { router } from "expo-router";
// // import * as Notifications from "expo-notifications";
// // import * as Device from "expo-device";

// import { Block, Button, Text, Image, Input, Switch } from "@/components";
// import { useData, useToast } from "@/hooks";
// import { supabase } from "@/utils/supabase";

// type ReminderPrefs = {
//   daily_enabled: boolean;
//   daily_time: string; // "HH:mm" 24h
// };

// const DEFAULTS: ReminderPrefs = {
//   daily_enabled: false,
//   daily_time: "08:00",
// };

// // Tag we use inside scheduled notification to find/cancel it later
// const REMINDER_TAG = "daily_islamic_reminder";

// async function ensurePermissions(): Promise<boolean> {
//   if (!Device.isDevice) return false;
//   const existing = await Notifications.getPermissionsAsync();
//   let status = existing.status;
//   if (status !== "granted") {
//     const req = await Notifications.requestPermissionsAsync();
//     status = req.status;
//   }
//   return status === "granted";
// }

// // Cancel any existing scheduled reminders we previously created
// async function cancelExistingDailyReminders() {
//   const scheduled = await Notifications.getAllScheduledNotificationsAsync();
//   const matches = scheduled.filter((n) => (n.content?.data as any)?.tag === REMINDER_TAG);
//   for (const n of matches) {
//     // @ts-ignore: identifier is available on schedule result objects returned by getAll...
//     if (n.identifier) await Notifications.cancelScheduledNotificationAsync(n.identifier);
//   }
// }

// // Parse "HH:mm" into {hour, minute}
// function parseTime(hhmm: string): { hour: number; minute: number } | null {
//   const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm.trim());
//   if (!m) return null;
//   const h = Number(m[1]);
//   const min = Number(m[2]);
//   if (h < 0 || h > 23 || min < 0 || min > 59) return null;
//   return { hour: h, minute: min };
// }

// // Schedule a daily local notification at HH:mm (device local time)
// async function scheduleDailyReminder(hhmm: string) {
//   const parsed = parseTime(hhmm);
//   if (!parsed) throw new Error("Invalid time format");
//   // Android channel (recommended)
//   await Notifications.setNotificationChannelAsync?.("default", {
//     name: "default",
//     importance: Notifications.AndroidImportance.MAX,
//   });

//   await cancelExistingDailyReminders();

//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: "Daily Islamic Reminder",
//       body: "Take a moment for dhikr, dua, or a short ayah.",
//       sound: true,
//       data: { tag: REMINDER_TAG },
//     },
//     trigger: {
//       channelId: "default",
//       repeats: true,
//       hour: parsed.hour,
//       minute: parsed.minute,
//     } as Notifications.DailyTriggerInput, // explicit type helps TS
//   });
// }

// export default function DailyIslamicReminder() {
//   const { theme } = useData();
//   const { show } = useToast();
//   const { colors, sizes, assets } = theme;

//   const [prefs, setPrefs] = useState<ReminderPrefs>(DEFAULTS);
//   const [saving, setSaving] = useState(false);

//   // Load user metadata
//   useEffect(() => {
//     (async () => {
//       const { data, error } = await supabase.auth.getUser();
//       if (error) return;
//       const meta = (data?.user?.user_metadata as any) ?? {};
//       const r = meta?.reminders ?? {};
//       setPrefs({
//         daily_enabled: r?.daily_enabled ?? DEFAULTS.daily_enabled,
//         daily_time: r?.daily_time ?? DEFAULTS.daily_time,
//       });
//     })();
//   }, []);

//   const saveMeta = async (next: ReminderPrefs) => {
//     setSaving(true);
//     const { data: me } = await supabase.auth.getUser();
//     const prevMeta = (me?.user?.user_metadata as any) ?? {};
//     const nextMeta = {
//       ...prevMeta,
//       reminders: { ...(prevMeta.reminders ?? {}), ...next },
//     };
//     const { error } = await supabase.auth.updateUser({ data: nextMeta });
//     setSaving(false);
//     if (error) show("error", error.message);
//   };

//   const onToggle = async (enabled: boolean) => {
//     // optimistic UI
//     const next = { ...prefs, daily_enabled: enabled };
//     setPrefs(next);

//     if (enabled) {
//       const granted = await ensurePermissions();
//       if (!granted) {
//         setPrefs({ ...prefs, daily_enabled: false });
//         show("error", "Permission denied. Enable notifications in device settings.");
//         return;
//       }
//       try {
//         await scheduleDailyReminder(prefs.daily_time);
//         await saveMeta({ ...next });
//         show("success", "Daily reminder enabled");
//       } catch (e: any) {
//         setPrefs({ ...prefs, daily_enabled: false });
//         show("error", e?.message || "Failed to schedule reminder");
//       }
//     } else {
//       await cancelExistingDailyReminders();
//       await saveMeta({ ...next });
//       show("success", "Daily reminder disabled");
//     }
//   };

//   const onTimeChange = async (text: string) => {
//     // keep raw text in the input, but validate on save
//     const next = { ...prefs, daily_time: text };
//     setPrefs(next);

//     // If already enabled and time is valid, reschedule immediately
//     const parsed = parseTime(text);
//     if (prefs.daily_enabled && parsed) {
//       try {
//         await scheduleDailyReminder(text);
//         await saveMeta(next);
//         show("success", `Reminder time set to ${text}`);
//       } catch (e: any) {
//         show("error", e?.message || "Failed to update reminder");
//       }
//     }
//   };

//   return (
//     <Block safe flex={1} color={colors.background} paddingHorizontal={sizes.padding}>
//       {/* Header */}
//       <Block
//         row
//         flex={0}
//         align="center"
//         justify="space-between"
//         paddingVertical={sizes.s}
//         marginBottom={sizes.sm}
//       >
//         <Button onPress={() => router.back()}>
//           <Image
//             radius={0}
//             width={10}
//             height={18}
//             color={colors.link}
//             source={assets.arrow}
//             transform={[{ rotate: "180deg" }]}
//           />
//         </Button>
//         <Text h5 semibold>Daily Islamic Reminder</Text>
//         <Block width={40} />
//       </Block>

//       {/* Body */}
//       <Block paddingHorizontal={sizes.md}>
//         <Block row justify="space-between" align="center" paddingVertical={sizes.sm}>
//           <Block>
//             <Text p semibold>Enable daily reminder</Text>
//             <Text size={12} color={colors.gray}>Sends a local notification every day</Text>
//           </Block>
//           <Switch
//             id="daily-reminder-toggle"
//             inactiveFillColor={colors.secondary}
//             checked={prefs.daily_enabled}
//             onPress={onToggle}
//           />
//         </Block>

//         <Block marginTop={sizes.m}>
//           <Text p semibold marginBottom={sizes.s}>Reminder time (24h)</Text>
//           <Input
//             placeholder="HH:mm (e.g., 08:00)"
//             autoCapitalize="none"
//             keyboardType="numbers-and-punctuation"
//             value={prefs.daily_time}
//             onChangeText={onTimeChange}
//             marginBottom={sizes.s}
//             error={parseTime(prefs.daily_time) ? undefined : "Use HH:mm, 00:00–23:59"}
//           />
//           <Text size={12} color={colors.gray}>
//             Notifications use your device’s local time. Changes are saved automatically{saving ? "…" : "."}
//           </Text>
//         </Block>
//       </Block>
//     </Block>
//   );
// }
