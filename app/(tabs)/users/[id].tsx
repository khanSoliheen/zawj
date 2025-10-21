import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router/build/hooks';
import React, { useEffect, useState } from 'react';

import { Block, Button, Image, MoreMenu, Text } from '@/components';
import { useAuth, useData, useToast } from '@/hooks';
import { RegistrationData } from '@/store/registration';
import { supabase } from '@/utils/supabase';
import { Utils } from '@/utils/utils';


const Profile = () => {
  const { theme } = useData();
  const { id } = useLocalSearchParams();
  const { currentUser } = useAuth();
  const { show } = useToast();
  const { assets, colors, sizes, gradients } = theme;

  const [userDetails, setUserDetails] = useState<RegistrationData | null>(null);
  const [menuOpen, setMenuOpen] = React.useState(false);

  useEffect(() => {
    async function getUserDetails() {
      if (!id) return;
      const { data, error } = await supabase
        .from('profiles_card_v')
        .select('*')
        .eq('id', id)
        .single();
      console.log(data)
      if (error) {
        show("error", error.message)
      } else {
        setUserDetails(data);
      }
    }
    getUserDetails();
  }, [show, id]);

  const nikahRequestHandler = async () => {
    if (!currentUser) return;

    // 1. Check if conversation exists
    const { data } = await supabase
      .from("conversations")
      .select("id")
      .or(`and(user1.eq.${currentUser.id},user2.eq.${id}),and(user1.eq.${id},user2.eq.${currentUser.id})`)
      .maybeSingle();

    let conversationId = data?.id;

    // 2. If not exists, create new conversation
    if (!conversationId) {
      const { data: newConv, error: insertError } = await supabase
        .from("conversations")
        .insert({
          user1: currentUser.id,
          user2: id,
        })
        .select("id")
        .single();

      if (insertError) {
        console.error("Error creating conversation:", insertError.message);
        return;
      }

      conversationId = newConv.id;
    }
    // 3. Navigate to chat screen
    router.push({ pathname: `/chat/${conversationId}`, params: { name: fullName, peerId: id } });
  };

  const fullName = `${userDetails?.first_name || ''} ${userDetails?.last_name || ''}`.trim();

  return (
    <Block safe flex={1} color={colors.background}>
      {/* Scrollable Content */}
      <Block scroll contentContainerStyle={{ paddingBottom: sizes.xxl }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Image
          background
          resizeMode="cover"
          padding={sizes.sm}
          paddingBottom={sizes.l}
          radius={sizes.cardRadius}
          source={assets.background}
        >
          <Block row justify="space-between" align="center" marginTop={10}>
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
                Back
              </Text>
            </Button>
            <Button onPress={() => setMenuOpen(true)}>
              <Image radius={0} width={20} height={20} source={assets.more} color={colors.text} />
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
              {fullName}
            </Text>
            <Text p center white>
              {userDetails?.gender}, {Utils.getAge(userDetails?.dob)} years
            </Text>
          </Block>
        </Image>

        {/* About */}
        <Block paddingHorizontal={sizes.sm} marginTop={sizes.l}>
          <Text h5 semibold marginBottom={sizes.s}>
            About Me
          </Text>
          <Text p lineHeight={26}>{userDetails?.bio ?? "User's bio not available"}</Text>
        </Block>

        {/* Details */}
        <Block paddingHorizontal={sizes.sm} marginTop={sizes.l}>
          <Text h5 semibold marginBottom={sizes.s}>Profile Details</Text>
          <Text p><Text semibold>Location:</Text> {userDetails?.state}</Text>
          <Text p><Text semibold>Education:</Text> {userDetails?.education}</Text>
          <Text p><Text semibold>Profession:</Text> {userDetails?.department}</Text>
        </Block>

        {/* Deen Practices */}
        <Block paddingHorizontal={sizes.sm} marginTop={sizes.l}>
          <Text h5 semibold marginBottom={sizes.s}>Deen Practices</Text>
          <Text p>Prayer: {userDetails?.prayer_regularity}</Text>
          <Text p>Qur’an Level: {userDetails?.quran_level}</Text>
          <Text p>{userDetails?.gender === 'Female' ? 'Hijab' : 'Beard'}: {userDetails?.hijab_or_beard}</Text>
        </Block>
      </Block>

      {/* Fixed Proposal Button */}
      <Block
        flex={0}
        style={{
          position: 'absolute',
          bottom: 10,
          right: 10,
        }}
      >
        <Button
          gradient={gradients.secondary}
          radius={30}
          paddingHorizontal={sizes.sm}
          onPress={nikahRequestHandler}
        >
          <Text color={colors.text} center semibold>
            Nikah Proposal
          </Text>
        </Button>
      </Block>
      {/* ... profile content ... */}

      <MoreMenu targetUserId={String(id)} visible={menuOpen} onClose={() => setMenuOpen(false)} />
    </Block>
  );
};

export default Profile;
