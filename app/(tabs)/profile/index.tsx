import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Platform } from 'react-native';

import { Block, Button, Image, Text } from '@/components';
import { useData } from '@/hooks';

const isAndroid = Platform.OS === 'android';

const Profile = () => {
  const user = useMemo(
    () => ({
      id: 1,
      name: 'Your Name',
      department: 'Software Developer',
      age: 28,
      location: 'Bangalore, India',
      status: 'Single',
      education: 'B.Tech (Computer Science)',
      profession: 'Software Engineer',
      deen: ['5x Salah', 'Qur’an Study', 'Charity Work'],
      wali: 'Father (verified)',
      badges: ['Wali Verified', 'ID Verified'],
      stats: { posts: 12, followers: 150, following: 80 },
      about:
        'This is your personal bio. Share a little bit about yourself here.',
      avatar:
        'https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?fit=crop&w=200&q=80',
    }),
    []
  );

  const router = useRouter();
  const { theme } = useData();
  const { assets, colors, sizes } = theme;

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
              <Button onPress={() => router.push('/profile/settings')}>
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
                source={{ uri: user?.avatar }}
              />
              <Text h5 center white>
                {user?.name}
              </Text>
              <Text p center white>
                {user?.department}
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
                <Text h5>{user?.stats?.posts}</Text>
                <Text>Posts</Text>
              </Block>
              <Block align="center">
                <Text h5>{user?.stats?.followers}</Text>
                <Text>Followers</Text>
              </Block>
              <Block align="center">
                <Text h5>{user?.stats?.following}</Text>
                <Text>Following</Text>
              </Block>
            </Block>
          </Block>

          {/* About */}
          <Block paddingHorizontal={sizes.sm}>
            <Text h5 semibold marginBottom={sizes.s} marginTop={sizes.sm}>
              About me
            </Text>
            <Text p lineHeight={26}>{user?.about}</Text>
          </Block>

          {/* Profile Details */}
          <Block paddingHorizontal={sizes.sm} marginTop={sizes.m}>
            <Text h5 semibold marginBottom={sizes.s}>
              Profile Details
            </Text>

            <Text p><Text semibold>Age:</Text> {user.age}</Text>
            <Text p><Text semibold>Location:</Text> {user.location}</Text>
            <Text p><Text semibold>Status:</Text> {user.status}</Text>
            <Text p><Text semibold>Education:</Text> {user.education}</Text>
            <Text p><Text semibold>Profession:</Text> {user.profession}</Text>

            <Text p semibold marginTop={sizes.s}>Deen Practices:</Text>
            <Block row wrap="wrap" marginTop={sizes.xs}>
              {user.deen.map((d, idx) => (
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
            </Block>

            <Text p marginTop={sizes.s}>
              <Text semibold>Wali:</Text> {user.wali}
            </Text>
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

export default Profile;
