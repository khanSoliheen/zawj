// import Constants from "expo-constants";
// import { router } from "expo-router";
// import React, { useMemo } from "react";
// // import * as Application from "expo-application";
// // import * as Clipboard from "expo-clipboard";

// import { Block, Button, Text, Image } from "@/components";
// import { useData, useToast } from "@/hooks";

// export default function About() {
//   const { theme } = useData();
//   const { show } = useToast();
//   const { colors, sizes, assets } = theme;

//   const info = useMemo(() => {
//     // Try multiple fields to support classic + EAS configs
//     const version =
//       (Constants.expoConfig as any)?.version ||
//       (Constants.manifest2 as any)?.extra?.version ||
//       "1.0.0";
//     const build =
//       (Constants.expoConfig as any)?.ios?.buildNumber ||
//       (Constants.expoConfig as any)?.android?.versionCode ||
//       (Constants.manifest2 as any)?.extra?.build ||
//       "1";
//     const appName =
//       (Constants.expoConfig as any)?.name ||
//       (Constants.manifest2 as any)?.extra?.name ||
//       "Zawj";
//     const appId =
//       Application.applicationId || (Constants.expoConfig as any)?.slug || "app.zawj";
//     const deviceId =
//       Application.androidId ||
//       Application.getIosIdForVendorAsync?.().catch(() => undefined) ||
//       undefined;

//     return { version, build, appName, appId, deviceId };
//   }, []);

//   const copyEnv = async () => {
//     const payload = `app=${info.appName}
// id=${info.appId}
// version=${info.version}
// build=${info.build}`;
//     await Clipboard.setStringAsync(payload);
//     show("success", "Copied app info");
//   };

//   return (
//     <Block safe flex={1} color={colors.background} paddingHorizontal={sizes.padding}>
//       {/* Header */}
//       <Block row flex={0} align="center" justify="space-between" paddingVertical={sizes.s} marginBottom={sizes.sm}>
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
//         <Text h5 semibold>About</Text>
//         <Block width={40} />
//       </Block>

//       {/* App info */}
//       <Block>
//         <Text p semibold marginBottom={sizes.s}>{info.appName}</Text>
//         <Text p color={colors.gray}>App ID</Text>
//         <Text p marginBottom={sizes.s}>{info.appId}</Text>

//         <Text p color={colors.gray}>Version</Text>
//         <Text p marginBottom={sizes.s}>{info.version} ({String(info.build)})</Text>

//         <Text p color={colors.gray}>Environment</Text>
//         {/*<Text p marginBottom={sizes.s}>
//           {Constants.executionEnvironment === 1 ? "Bare" :
//             Constants.executionEnvironment === 2 ? "Standalone" :
//               Constants.executionEnvironment === 3 ? "Store Client" : "Expo"}
//         </Text>*/}

//         <Button onPress={copyEnv} marginTop={sizes.s}>
//           <Text p semibold color={colors.link}>Copy app info</Text>
//         </Button>

//         {/* Optional: link to licenses screen if you have it */}
//         <Button onPress={() => router.push("/licenses")} marginTop={sizes.s}>
//           <Block row align="center" justify="space-between">
//             <Text p semibold>Open source licenses</Text>
//             <Image source={assets.arrow} radius={0} color={colors.gray} />
//           </Block>
//         </Button>
//       </Block>
//     </Block>
//   );
// }
