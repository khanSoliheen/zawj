import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';

import { Block, Button, Image, Text } from '@/components';
import { useAuth, useData, useToast } from '@/hooks';
import { RegistrationData } from '@/store/registration';
import { supabase } from '@/utils/supabase';

const isAndroid = Platform.OS === 'android';

function getAge(dob?: string) {
  if (!dob) return '—';
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  if (
    today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())
  ) {
    age--;
  }
  return age;
}

const Profile = () => {
  const { theme } = useData();
  const { currentUser } = useAuth();
  const { show } = useToast();
  const { assets, colors, sizes } = theme;

  const [profile, setProfile] = useState<RegistrationData | null>(null);

  useEffect(() => {
    async function getUserDetails() {
      if (!currentUser?.id) return;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (error) {
        show("error", error.message);
      } else {
        setProfile(data);
      }
    }
    getUserDetails();
  }, [show, currentUser]);

  const fullName = `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim();

  return (
    <Block color={colors.background} safe marginTop={sizes.md}>
      <Block
        scroll
        paddingHorizontal={sizes.s}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: sizes.padding }}
      >
        <Block flex={0}>
          {/* Header with Back + Settings */}
          <Image
            background
            resizeMode="cover"
            padding={sizes.sm}
            paddingBottom={sizes.l}
            radius={sizes.cardRadius}
            source={assets.background}
          >
            <Block row justify="space-between" align="center">
              {/* Back */}
              <Button row flex={0} justify="flex-start" onPress={() => router.back()}>
                <Image
                  radius={0}
                  width={10}
                  height={18}
                  color={colors.white}
                  source={assets.arrow}
                  transform={[{ rotate: '180deg' }]}
                />
                <Text p white marginLeft={sizes.s}>
                  Profile
                </Text>
              </Button>

              {/* Settings */}
              <Button onPress={() => router.push("/screens/settings")}>
                <Image
                  source={assets.settings}
                  width={20}
                  height={20}
                  color={colors.white}
                />
              </Button>
            </Block>

            {/* Avatar + Name */}
            <Block flex={0} align="center" marginTop={sizes.sm}>
              <Image
                width={100}
                height={100}
                radius={50}
                marginBottom={sizes.sm}
                source={assets.avatar1}
              />
              <Text h5 center white>
                {fullName || 'Anonymous'}
              </Text>
              <Text p center white>
                {profile?.designation}
              </Text>
            </Block>
          </Image>

          {/* Stats */}
          <Block
            flex={0}
            radius={sizes.sm}
            shadow={!isAndroid}
            marginTop={-sizes.l}
            marginHorizontal="8%"
          >
            <Block
              row
              blur
              flex={0}
              intensity={100}
              radius={sizes.sm}
              overflow="hidden"
              tint={colors.blurTint}
              justify="space-evenly"
              paddingVertical={sizes.sm}
              renderToHardwareTextureAndroid
            >
              <Block align="center">
                <Text h5>{10}</Text>
                <Text>Posts</Text>
              </Block>
              <Block align="center">
                <Text h5>{0}</Text>
                <Text>Followers</Text>
              </Block>
              <Block align="center">
                <Text h5>{0}</Text>
                <Text>Following</Text>
              </Block>
            </Block>
          </Block>

          {/* About */}
          <Block paddingHorizontal={sizes.sm}>
            <Text h5 semibold marginBottom={sizes.s} marginTop={sizes.sm}>
              About me
            </Text>
            <Text p lineHeight={26}>{profile?.waliName}</Text>
          </Block>

          {/* Profile Details */}
          <Block paddingHorizontal={sizes.sm} marginTop={sizes.m}>
            <Text h5 semibold marginBottom={sizes.s}>
              Profile Details
            </Text>

            <Text p><Text semibold>Age:</Text> {getAge(profile?.dob)}</Text>
            <Text p><Text semibold>Location:</Text> {profile?.city}, {profile?.country}</Text>
            <Text p><Text semibold>Status:</Text> {profile?.maritalStatus}</Text>
            <Text p><Text semibold>Education:</Text> {"B.tech"}</Text>
            <Text p><Text semibold>Profession:</Text> {"software"}</Text>

            <Text p semibold marginTop={sizes.s}>Deen Practices:</Text>
            {/*<Block row wrap="wrap" marginTop={sizes.xs}>
              {profile.deen?.map((d: string, idx: number) => (
                <Block
                  key={idx}
                  radius={10}
                  paddingHorizontal={sizes.s}
                  paddingVertical={sizes.xs}
                  marginRight={sizes.s}
                  marginBottom={sizes.xs}
                  color={colors.light}
                >
                  <Text size={sizes.s} gray>{d}</Text>
                </Block>
              ))}
            </Block>*/}

            <Text p marginTop={sizes.s}>
              <Text semibold>Wali:</Text> {profile?.waliName} ({profile?.waliRelation})
            </Text>

            {/*{profile. === 'verified' && (*/}
            <Text p color={colors.primary} marginTop={sizes.s}>
              ✅ ID Verified
            </Text>
            {/*)}*/}
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

export default Profile;
