import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { StatusBar, FlatList, TouchableOpacity } from 'react-native';

import { Block, Image, Text } from '@/components';
import { useTheme } from '@/hooks';

type ChatItem = {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  avatar: any;
  unread?: number;
};

const mockChats: ChatItem[] = [
  {
    id: '1',
    name: 'John Doe',
    lastMessage: 'Hey, how are you?',
    time: '10:24 AM',
    avatar: require('@/assets/images/avatar1.png'),
    unread: 2,
  },
  {
    id: '2',
    name: 'Jane Smith',
    lastMessage: 'See you tomorrow!',
    time: '09:15 AM',
    avatar: require('@/assets/images/avatar1.png'),
  },
  {
    id: '3',
    name: 'Dev Group',
    lastMessage: 'Let’s deploy tonight 🚀',
    time: 'Yesterday',
    avatar: require('@/assets/images/avatar1.png'),
    unread: 5,
  },
];

const ChatList = () => {
  const { colors, sizes } = useTheme();
  const router = useRouter();
  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    return () => {
      StatusBar.setBarStyle('dark-content');
    };
  }, []);

  const renderItem = ({ item }: { item: ChatItem }) => (
    <TouchableOpacity onPress={() => router.push(`/chat/${item.id}`)} activeOpacity={0.8}>
      <Block
        row
        align="center"
        padding={sizes.m}
        marginBottom={sizes.s}
        radius={sizes.cardRadius || 12}
        color={colors.card}
        shadow
      >
        {/* Avatar */}
        <Image
          source={item.avatar}
          radius={30}
          style={{ width: 52, height: 52, marginRight: sizes.m }}
        />

        {/* Name + last message */}
        <Block flex={1}>
          <Text semibold>{item.name}</Text>
          <Text gray numberOfLines={1}>{item.lastMessage}</Text>
        </Block>

        {/* Time + unread badge */}
        <Block align="flex-end" marginLeft={sizes.sm}>
          <Text gray>{item.time}</Text>
          {item.unread ? (
            <Block
              center
              align="center"
              radius={12}
              paddingHorizontal={sizes.s}
              style={{
                backgroundColor: colors.primary,
                marginTop: sizes.s,
                minWidth: 24,
              }}>
              <Text white bold size={sizes.s}>
                {item.unread}
              </Text>
            </Block>
          ) : null}
        </Block>
      </Block>
    </TouchableOpacity>
  );

  return (
    <Block safe flex={1} color={colors.background}>
      <FlatList
        data={mockChats}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{
          padding: sizes.m,
          paddingBottom: sizes.l,
        }}
      />
    </Block>
  );
};

export default ChatList;
