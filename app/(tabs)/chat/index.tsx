import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StatusBar, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';

import { Block, Image, Text } from '@/components';
import { useAuth, useData, useToast } from '@/hooks';
import { supabase } from '@/utils/supabase';

type ChatItem = {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  avatar: any;
};

const ChatList = () => {
  const { theme } = useData();
  const { currentUser } = useAuth();
  const { show } = useToast();
  const { colors, sizes } = theme;

  const [chats, setChats] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(true);

  const staticAvatar = require('@/assets/images/avatar1.png'); // ✅ single fallback image
  const userId = currentUser?.id;
  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    return () => StatusBar.setBarStyle('dark-content');
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchChats = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from('conversations')
        .select(`
          id,
          user1,
          user2,
          user1_profile:user1(firstName, lastName),
          user2_profile:user2(firstName, lastName),
          messages(content, created_at)
        `)
        .or(`user1.eq.${userId},user2.eq.${userId}`)
        .order('created_at', { ascending: false });
      if (error) {
        show("error", error.message)
        setChats([]);
      } else if (data) {
        const formatted = data.map((c: any) => {
          const isUser1 = c.user1 === userId;
          const other = isUser1 ? c.user2_profile : c.user1_profile;

          const sortedMessages = [...(c.messages ?? [])].sort(
            (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );

          const lastMessage = sortedMessages[sortedMessages.length - 1];
          return {
            id: c.id,
            name: `${other?.firstName || 'User'} ${other?.lastName || ''}`,
            lastMessage: lastMessage?.content || 'No messages yet',
            time: lastMessage
              ? new Date(lastMessage.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : '',
            avatar: staticAvatar, // ✅ use static placeholder
          };
        });
        setChats(formatted);
      }

      setLoading(false);
    };

    fetchChats();
  }, [staticAvatar, userId, show]);

  const renderItem = ({ item }: { item: ChatItem }) => (
    <TouchableOpacity onPress={() => router.push({
      pathname: `/chat/${item.id}`, params: {
        name: item.name,
      }
    })} activeOpacity={0.8}>
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

        {/* Time */}
        {item.time ? (
          <Block align="flex-end" marginLeft={sizes.sm}>
            <Text gray>{item.time}</Text>
          </Block>
        ) : null}
      </Block>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <Block safe flex={1} color={colors.background} center align="center" justify="center">
        <ActivityIndicator size="large" color={colors.primary} />
      </Block>
    );
  }

  if (chats.length === 0) {
    return (
      <Block safe flex={1} color={colors.background} center justify="center" align="center">
        <Image
          source={require('@/assets/images/avatar2.png')}
          style={{ width: 120, height: 120, marginBottom: sizes.m }}
        />
        <Text h6 gray>No conversations yet</Text>
        <Text p gray>Start a chat with someone new</Text>
      </Block>
    );
  }

  return (
    <Block safe flex={1} color={colors.background}>
      <FlatList
        data={chats}
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
