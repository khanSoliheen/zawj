// import { router } from "expo-router";
// import React, { useState } from "react";

// import { Block, Button, Text, Image } from "@/components";
// import { useData } from "@/hooks";

// type QA = { q: string; a: string; route?: string };

// const FAQS: QA[] = [
//   {
//     q: "How do I change my password?",
//     a: "Go to Settings → Change Password, enter the new password, and tap Save.",
//     route: "/settings/change-password",
//   },
//   {
//     q: "How do I verify my phone?",
//     a: "Open Settings → Verify Phone, request the SMS code, then enter it to confirm.",
//     route: "/settings/verify-phone",
//   },
//   {
//     q: "How do I control who can message me?",
//     a: "Use Settings → Profile Visibility to choose who can start conversations.",
//     route: "/settings/visibility",
//   },
//   {
//     q: "How do I turn notifications on/off?",
//     a: "Go to Settings → Notifications to manage push, messages, marketing, and sounds.",
//     route: "/settings/notifications",
//   },
//   {
//     q: "How do I delete my account?",
//     a: "Open Settings → Delete Account and follow the confirmation steps. This is permanent.",
//     route: "/settings/delete-account",
//   },
// ];

// export default function HelpFAQ() {
//   const { theme } = useData();
//   const { colors, sizes, assets } = theme;

//   const [open, setOpen] = useState<number | null>(null);

//   const Row = ({ item, index }: { item: QA; index: number }) => {
//     const isOpen = open === index;
//     return (
//       <Block paddingVertical={sizes.sm} >
//         <Button onPress={() => setOpen(isOpen ? null : index)}>
//           <Block row align="center" justify="space-between">
//             <Text p semibold>{item.q}</Text>
//             <Image
//               radius={0}
//               width={10}
//               height={18}
//               color={colors.gray}
//               source={assets.arrow}
//               transform={[{ rotate: isOpen ? "90deg" : "0deg" }]}
//             />
//           </Block>
//         </Button>

//         {isOpen ? (
//           <Block marginTop={sizes.s}>
//             <Text p color={colors.gray}>{item.a}</Text>
//             {item.route ? (
//               <Button onPress={() => router.push(item.route)} marginTop={sizes.s}>
//                 <Text p semibold color={colors.link}>Open</Text>
//               </Button>
//             ) : null}
//           </Block>
//         ) : null}
//       </Block >
//     );
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
//         <Text h5 semibold>Help & FAQ</Text>
//         <Block width={40} />
//       </Block>

//       {/* FAQ */}
//       <Block paddingHorizontal={sizes.md}>
//         {FAQS.map((f, i) => (
//           <Row key={f.q} item={f} index={i} />
//         ))}

//         {/* Quick links */}
//         <Block marginTop={sizes.m}>
//           <Text p semibold marginBottom={sizes.s}>Need more help?</Text>

//           <Button onPress={() => router.push("/settings/report")}>
//             <Block row align="center" justify="space-between" paddingVertical={sizes.sm}>
//               <Text p>Report Misconduct</Text>
//               <Image source={assets.arrow} radius={0} color={colors.gray} />
//             </Block>
//           </Button>

//           <Button onPress={() => router.push("/support")}>
//             <Block row align="center" justify="space-between" paddingVertical={sizes.sm}>
//               <Text p>Contact Support</Text>
//               <Image source={assets.arrow} radius={0} color={colors.gray} />
//             </Block>
//           </Button>

//           <Button onPress={() => router.push("/settings/policy")}>
//             <Block row align="center" justify="space-between" paddingVertical={sizes.sm}>
//               <Text p>Islamic Policy</Text>
//               <Image source={assets.arrow} radius={0} color={colors.gray} />
//             </Block>
//           </Button>
//         </Block>
//       </Block>
//     </Block>
//   );
// }
