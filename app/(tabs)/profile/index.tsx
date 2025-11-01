import { Buffer } from 'buffer';

import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';

import { Block, Button, Image, Text } from '@/components';
import { useAuth, useData, useToast } from '@/hooks';
import { RegistrationData } from '@/store/registration';
import { supabase } from '@/utils/supabase';

if (!(globalThis as any).Buffer) {
  (globalThis as any).Buffer = Buffer;
}

const isAndroid = Platform.OS === 'android';
const AVATAR_BUCKET = 'zawj';

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
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    (async () => {
      if (!currentUser?.id) return;
      const { data, error } = await supabase
        .from('profiles_card_v')
        .select('*')
        .eq('user_id', currentUser.id)
        .maybeSingle();
      if (error) {
        show("error", error.message);
      } else if (data) {
        setProfile(data);
        setAvatarUrl(data?.avatar_url ?? null);
      }
    })();
  }, [show, currentUser]);

  const pickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      show('error', 'Permission to access photos is required.');
      return;
    }

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (res.canceled) return;
    const file = res.assets[0];
    await uploadAvatar(file);
  };

  const uploadAvatar = async (asset: ImagePicker.ImagePickerAsset) => {
    try {
      if (!currentUser?.id) return;
      setUploading(true);
      const ext = asset.fileName?.split('.').pop() || asset.mimeType?.split('/').pop() || 'jpg';
      const path = `avatars/${currentUser.id}_${Date.now()}.${ext}`;

      const base64 = await FileSystem.readAsStringAsync(asset.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const buffer = Buffer.from(base64, 'base64');
      const contentType = asset.mimeType || 'image/jpeg';
      const { error: upErr } = await supabase.storage.from(AVATAR_BUCKET).upload(path, buffer, {
        contentType,
        upsert: true,
      });
      if (upErr) throw upErr;

      const { data: pub } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path);
      const publicUrl = pub.publicUrl;
      const { error: profErr } = await supabase
        .from('profiles_core')
        .update({ avatar_url: publicUrl })
        .eq('user_id', currentUser.id);

      if (profErr) throw profErr;

      setAvatarUrl(publicUrl);
      setProfile((prev) => (prev ? { ...prev, avatar_url: publicUrl } : prev));
      show('success', 'Photo updated');
    } catch (err: any) {
      show('error', err?.message || 'Failed to upload');
    } finally {
      setUploading(false);
    }
  };

  const fullName = `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim();

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
                source={avatarUrl ? { uri: avatarUrl } : assets.avatar1}
              />
              <Button onPress={pickAvatar} disabled={uploading} marginBottom={sizes.sm}>
                <Text p center color={colors.white}>
                  {uploading ? 'Uploading…' : 'Change photo'}
                </Text>
              </Button>
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
            <Text p lineHeight={26}>{profile?.wali_name}</Text>
          </Block>

          {/* Profile Details */}
          <Block paddingHorizontal={sizes.sm} marginTop={sizes.m}>
            <Text h5 semibold marginBottom={sizes.s}>
              Profile Details
            </Text>

            <Text p><Text semibold>Age:</Text> {getAge(profile?.dob)}</Text>
            <Text p><Text semibold>Location:</Text> {profile?.city}, {profile?.country}</Text>
            <Text p><Text semibold>Status:</Text> {profile?.marital_status}</Text>
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
              <Text semibold>Wali:</Text> {profile?.wali_name || ''} ({profile?.wali_relation || ''})
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
