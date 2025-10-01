import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Platform } from 'react-native';

import { Block, Button, Image, Text } from '@/components';
import { useData } from '@/hooks';

const isAndroid = Platform.OS === 'android';

const Profile = () => {
  const user = useMemo(() => ({
    id: 1,
    name: 'Your Name',
    department: 'Software Developer',
    stats: { posts: 12, followers: 150, following: 80 },
    about:
      'This is your personal bio. Share a little bit about yourself here.',
    avatar:
      'https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?fit=crop&w=200&q=80',
  }), []);

  const router = useRouter();
  const { theme } = useData();
  const { assets, colors, sizes } = theme;

  const IMAGE_VERTICAL_SIZE =
    (sizes.width - (sizes.padding + sizes.sm) * 2) / 2;
  const IMAGE_MARGIN = (sizes.width - IMAGE_VERTICAL_SIZE * 2 - sizes.padding * 2) / 2;

  return (
    <Block color={colors.background} safe marginTop={sizes.md}>
      <Block
        scroll
        paddingHorizontal={sizes.s}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: sizes.padding }}>
        <Block flex={0}>
          {/* Profile header with Settings */}
          <Image
            background
            resizeMode="cover"
            padding={sizes.sm}
            paddingBottom={sizes.l}
            radius={sizes.cardRadius}
            source={assets.background}>
            <Block row justify="space-between" align="center">
              <Button
                row
                flex={0}
                justify="flex-start"
                onPress={() => router.back()}>
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

              {/* Settings button */}
              <Button onPress={() => router.push('/profile/settings')}>
                <Ionicons name="settings-outline" size={20} color={colors.white} />
              </Button>
            </Block>

            {/* User details */}
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

          {/* profile: stats */}
          <Block
            flex={0}
            radius={sizes.sm}
            shadow={!isAndroid}
            marginTop={-sizes.l}
            marginHorizontal="8%">
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
              renderToHardwareTextureAndroid>
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

          {/* profile: about me */}
          <Block paddingHorizontal={sizes.sm}>
            <Text white h5 semibold marginBottom={sizes.s} marginTop={sizes.sm}>
              About me
            </Text>
            <Text white p lineHeight={26}>
              {user?.about}
            </Text>
          </Block>

          {/* profile: photo album */}
          <Block paddingHorizontal={sizes.sm} marginTop={sizes.s}>
            <Block row align="center" justify="space-between">
              <Text white h5 semibold>
                My Photos
              </Text>
              <Button>
                <Text p primary semibold>
                  View all
                </Text>
              </Button>
            </Block>
            <Block row justify="space-between" wrap="wrap">
              <Image
                resizeMode="cover"
                source={assets?.photo1}
                style={{
                  width: IMAGE_VERTICAL_SIZE + IMAGE_MARGIN / 2,
                  height: IMAGE_VERTICAL_SIZE * 2 + IMAGE_MARGIN,
                }}
              />
              <Block marginLeft={sizes.m}>
                <Image
                  resizeMode="cover"
                  source={assets?.photo2}
                  marginBottom={IMAGE_MARGIN}
                  style={{
                    height: IMAGE_VERTICAL_SIZE,
                    width: IMAGE_VERTICAL_SIZE,
                  }}
                />
                <Image
                  resizeMode="cover"
                  source={assets?.photo3}
                  style={{
                    height: IMAGE_VERTICAL_SIZE,
                    width: IMAGE_VERTICAL_SIZE,
                  }}
                />
              </Block>
            </Block>
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

export default Profile;
