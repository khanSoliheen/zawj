// import { zodResolver } from "@hookform/resolvers/zod";
// import { router } from "expo-router";
// import React, { useState } from "react";
// import { Controller, useForm } from "react-hook-form";
// import { Alert } from "react-native";
// import { z } from "zod";

// import { Block, Button, Text, Image, Input } from "@/components";
// import { useData, useToast } from "@/hooks";
// import { supabase } from "@/utils/supabase";

// // Type a short phrase to confirm. You can change "DELETE" to anything.
// const schema = z.object({
//   confirm: z.literal("DELETE", { error: "Type DELETE to confirm" }),
//   reason: z.string().trim().optional(),
// });
// type FormValues = z.infer<typeof schema>;

// export default function DeleteAccount() {
//   const { theme } = useData();
//   const { show } = useToast();
//   const { colors, sizes, assets } = theme;

//   const [submitting, setSubmitting] = useState(false);

//   const {
//     control,
//     handleSubmit,
//     formState: { errors, dirtyFields, isValid, isSubmitting },
//   } = useForm<FormValues>({
//     resolver: zodResolver(schema as any),
//     mode: "onBlur",
//     reValidateMode: "onChange",
//     defaultValues: { confirm: "" as any, reason: "" },
//   });

//   const onDelete = async ({ reason }: FormValues) => {
//     setSubmitting(true);
//     try {
//       // Get current session for auth header
//       const { data: sessionData } = await supabase.auth.getSession();
//       const accessToken = sessionData?.session?.access_token;
//       if (!accessToken) {
//         show("error", "You must be signed in.");
//         setSubmitting(false);
//         return;
//       }

//       // Call Edge Function (server) to delete the user securely
//       const res = await fetch(`https://mgqxzolgwydswskwgqgp.supabase.co/v1/delete-account`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ reason }),
//       });

//       if (!res.ok) {
//         const msg = await res.text().catch(() => "");
//         show("error", msg || "Failed to delete account");
//         setSubmitting(false);
//         return;
//       }

//       // Sign out locally
//       await supabase.auth.signOut();
//       show("success", "Your account has been deleted");
//       router.replace("/login");
//     } catch (e: any) {
//       show("error", e?.message || "Unexpected error");
//       setSubmitting(false);
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
//         <Text h5 semibold>Delete Account</Text>
//         <Block width={40} />
//       </Block>

//       {/* Warning */}
//       <Block>
//         <Text p color={colors.danger} semibold marginBottom={sizes.s}>
//           This is permanent.
//         </Text>
//         <Text p marginBottom={sizes.m}>
//           Deleting your account will remove your profile, matches, messages, and settings. This action cannot be undone.
//         </Text>

//         {/* Reason (optional) */}
//         <Controller
//           control={control}
//           name="reason"
//           render={({ field: { onChange, onBlur, value, ref } }) => (
//             <Input
//               placeholder="Tell us why you're leaving (optional)"
//               autoCapitalize="sentences"
//               autoCorrect
//               marginBottom={sizes.s}
//               value={value}
//               onChangeText={onChange}
//               onBlur={onBlur}
//               ref={ref}
//               multiline
//               numberOfLines={4}
//             />
//           )}
//         />

//         {/* Confirm text */}
//         <Text p semibold marginBottom={sizes.s}>
//           Type <Text semibold color={colors.danger}>"DELETE"</Text> to confirm
//         </Text>
//         <Controller
//           control={control}
//           name="confirm"
//           render={({ field: { onChange, onBlur, value, ref } }) => (
//             <Input
//               placeholder='DELETE'
//               autoCapitalize="characters"
//               autoCorrect={false}
//               marginBottom={sizes.s}
//               value={value}
//               onChangeText={onChange}
//               onBlur={onBlur}
//               ref={ref}
//               error={errors.confirm?.message}
//               success={dirtyFields.confirm && !errors.confirm}
//             />
//           )}
//         />

//         <Button
//           color={colors.danger}
//           marginTop={sizes.s}
//           disabled={!isValid || isSubmitting || submitting}
//           onPress={handleSubmit(() =>
//             Alert.alert(
//               "Delete account?",
//               "This is permanent and cannot be undone.",
//               [
//                 { text: "Cancel", style: "cancel" },
//                 { text: "Delete", style: "destructive" },
//               ]
//             )
//           )}
//         >
//           <Text white semibold>{(isSubmitting || submitting) ? "Deleting…" : "Delete my account"}</Text>
//         </Button>

//         <Button marginTop={sizes.s} onPress={() => router.back()}>
//           <Text p color={colors.link}>Cancel</Text>
//         </Button>
//       </Block>
//     </Block>
//   );
// }
