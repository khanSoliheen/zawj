import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { Platform, Linking } from 'react-native';

import { Block, Button, Image, Text } from '@/components';
import { useTheme } from '@/hooks';


const isAndroid = Platform.OS === 'android';

const Profile = () => {
  const user = useMemo(() => ({
    id: 1,
    name: 'Devin Coldewey',
    department: 'Marketing Manager',
    stats: { posts: 323, followers: 53200, following: 749000 },
    social: { twitter: 'CreativeTim', dribbble: 'creativetim' },
    about:
      'Decisions: If you can’t decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality).',
    avatar:
      'https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?fit=crop&w=80&q=80',
  }), []);

  // const { t } = useTranslation();
  const navigation = useNavigation();
  const { assets, colors, sizes } = useTheme();

  const IMAGE_SIZE = (sizes.width - (sizes.padding + sizes.sm) * 2) / 3;
  const IMAGE_VERTICAL_SIZE =
    (sizes.width - (sizes.padding + sizes.sm) * 2) / 2;
  const IMAGE_MARGIN = (sizes.width - IMAGE_SIZE * 3 - sizes.padding * 2) / 2;
  const IMAGE_VERTICAL_MARGIN =
    (sizes.width - (IMAGE_VERTICAL_SIZE + sizes.sm) * 2) / 2;

  const handleSocialLink = useCallback(
    (type: 'twitter' | 'dribbble') => {
      const url =
        type === 'twitter'
          ? `https://twitter.com/${user?.social?.twitter}`
          : `https://dribbble.com/${user?.social?.dribbble}`;

      try {
        Linking.openURL(url);
      } catch {
        alert(`Cannot open URL: ${url}`);
      }
    },
    [user],
  );

  return (
    <Block safe marginTop={sizes.md}>
      <Block
        scroll
        paddingHorizontal={sizes.s}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: sizes.padding }}>
        <Block flex={0}>
          <Image
            background
            resizeMode="cover"
            padding={sizes.sm}
            paddingBottom={sizes.l}
            radius={sizes.cardRadius}
            source={assets.background}>
            <Button
              row
              flex={0}
              justify="flex-start"
              onPress={() => navigation.goBack()}>
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
            <Block flex={0} align="center">
              <Image
                width={100}
                height={100}
                marginBottom={sizes.sm}
                source={{ uri: user?.avatar }}
              />
              <Text h5 center white>
                {user?.name}
              </Text>
              <Text p center white>
                {user?.department}
              </Text>
              <Block row marginVertical={sizes.m}>
                <Button
                  white
                  outlined
                  shadow={false}
                  radius={sizes.m}
                  onPress={() => {
                    alert(`Follow ${user?.name}`);
                  }}>
                  <Block
                    justify="center"
                    radius={sizes.m}
                    paddingHorizontal={sizes.m}
                  >
                    <Text white bold transform="uppercase">
                      Follow
                    </Text>
                  </Block>
                </Button>
                <Button
                  shadow={false}
                  radius={sizes.m}
                  marginHorizontal={sizes.sm}
                  outlined={String(colors.white)}
                  onPress={() => handleSocialLink('twitter')}>
                  <Ionicons
                    size={18}
                    name="logo-twitter"
                    color={colors.white}
                  />
                </Button>
                <Button
                  shadow={false}
                  radius={sizes.m}
                  outlined={String(colors.white)}
                  onPress={() => handleSocialLink('dribbble')}>
                  <Ionicons
                    size={18}
                    name="logo-dribbble"
                    color={colors.white}
                  />
                </Button>
              </Block>
            </Block>
          </Image>

          {/* profile: stats */}
          <Block
            flex={0}
            radius={sizes.sm}
            shadow={!isAndroid} // disabled shadow on Android due to blur overlay + elevation issue
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
                <Text h5>{(user?.stats?.followers || 0) / 1000}k</Text>
                <Text>Followers</Text>
              </Block>
              <Block align="center">
                <Text h5>{(user?.stats?.following || 0) / 1000}k</Text>
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
                album
              </Text>
              <Button>
                <Text p primary semibold>
                  view all
                </Text>
              </Button>
            </Block>
            <Block row justify="space-between" wrap="wrap">
              <Image
                resizeMode="cover"
                source={assets?.photo1}
                style={{
                  width: IMAGE_VERTICAL_SIZE + IMAGE_MARGIN / 2,
                  height: IMAGE_VERTICAL_SIZE * 2 + IMAGE_VERTICAL_MARGIN,
                }}
              />
              <Block marginLeft={sizes.m}>
                <Image
                  resizeMode="cover"
                  source={assets?.photo2}
                  marginBottom={IMAGE_VERTICAL_MARGIN}
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
        </Block >
      </Block >
    </Block >
  );
};

export default Profile;
