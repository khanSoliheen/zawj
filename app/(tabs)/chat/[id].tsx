import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList } from 'react-native';

import { Block, Bubble, Button, DateDivider, Image, Input, Text, TimeStamp } from '@/components';
import { useAuth, useData } from '@/hooks';
import { supabase } from '@/utils/supabase';

export type Message = {
  id: string;
  text: string;
  at: string;        // ISO date
  sender_id: string;
  avatar?: string | null;
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

export default function Chat() {
  const { theme } = useData();
  const { currentUser } = useAuth();
  const { colors, sizes, assets, gradients } = theme;

  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const listRef = useRef<FlatList<any>>(null);

  // ✅ safer param hook
  const { id: conversationId } = useLocalSearchParams<{ id: string }>();
  const userId = currentUser?.id;

  // ✅ dummy avatars
  const meAvatar = assets.avatar2 ?? assets.avatar1;
  const themAvatar = assets.avatar1 ?? assets.avatar2;

  // ✅ fetch old messages
  useEffect(() => {
    if (!conversationId) return;
    (async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*') // no join, keep it simple
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.log('fetch error', error);
        return;
      }

      setMessages(
        data.map((m: any) => ({
          id: m.id,
          text: m.message ?? m.content, // use whichever exists
          at: m.created_at,
          sender_id: m.sender_id,
          avatar: null,
        }))
      );
    })();
  }, [conversationId, userId, meAvatar, themAvatar]);

  // ✅ realtime subscription
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`chat-${conversationId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` },
        (payload) => {
          const m = payload.new;
          setMessages((prev) => {
            if (prev.some((msg) => msg.id === m.id)) return prev;
            return [
              ...prev,
              {
                id: m.id,
                text: m.message ?? m.content,
                at: m.created_at,
                sender_id: m.sender_id,
                avatar: null,
              },
            ];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, userId, meAvatar, themAvatar]);

  // ✅ send message
  const sendMessage = async () => {
    const content = text.trim();
    if (!content || !userId || !conversationId) return;

    setText(''); // clear immediately

    const { error } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_id: userId,
      content,
    });

    if (error) {
      console.log('sendMessage error:', error);
      setText(content); // restore on failure
    }
    console.log('sendMessage success');
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
  };

  // ✅ group by date
  const flatData = useMemo(() => {
    const groups: Record<string, Message[]> = {};
    messages.forEach((m) => {
      const k = fmtDate(m.at);
      if (!groups[k]) groups[k] = [];
      groups[k].push(m);
    });
    const rows: Array<{ type: 'header'; header: string } | ({ type: 'msg' } & Message)> = [];
    Object.entries(groups)
      .sort((a, b) => new Date(a[1][0].at).getTime() - new Date(b[1][0].at).getTime())
      .forEach(([header, data]) => {
        rows.push({ type: 'header', header });
        data.forEach((m) => rows.push({ type: 'msg', ...m }));
      });
    return rows;
  }, [messages]);

  return (
    <Block color={colors.background}>
      {/* header */}
      <Block
        flex={0}
        row
        align="center"
        color={colors.white}
        paddingHorizontal={sizes.m}
      >
        {/* Left side */}
        <Block row align="center">
          <Button
            row
            flex={0}
            justify="flex-start"
            width={0}
            onPress={() => router.back()}>
            <Image
              radius={0}
              width={10}
              height={18}
              color={colors.gray}
              source={assets.arrow}
              transform={[{ rotate: '180deg' }]}
            />
          </Button>
          <Text h6>Chat</Text>
        </Block>

        {/* Right side */}
        <Block row align="center" position='absolute' right={10}>
          <Image
            source={assets.bell}
            width={20}
            height={20}
            style={{ marginLeft: sizes.s }}
          />
          <Image
            source={meAvatar}
            width={28}
            height={28}
            radius={14}
            style={{ marginLeft: sizes.s }}
          />
        </Block>
      </Block>
      {/* messages */}
      <Block flex={1} marginBottom={10}>
        <FlatList
          ref={listRef}
          data={flatData}
          keyExtractor={(item, idx) => ('type' in item && item.type === 'header' ? `h-${item.header}-${idx}` : (item as any).id)}
          contentContainerStyle={{ paddingHorizontal: sizes.m, paddingBottom: sizes.s, paddingTop: sizes.s }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            if ('type' in item && item.type === 'header') {
              return <DateDivider title={item.header} />;
            }
            const m = item as Message;
            return (
              <Block>
                <Bubble m={m} userId={userId!} meAvatar={meAvatar} themAvatar={themAvatar} />
                <TimeStamp iso={m.at} align={m.sender_id === userId ? 'right' : 'left'} />
              </Block>
            );
          }}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
          onLayout={() => listRef.current?.scrollToEnd({ animated: false })}
        />
      </Block>
      {/* input bar */}
      <Block
        row
        flex={0}
        align="center"
        style={{ marginHorizontal: sizes.m, marginBottom: sizes.md, paddingHorizontal: sizes.s, paddingVertical: sizes.s }}
      >
        <Block flex={1} marginHorizontal={sizes.s}>
          <Input placeholder="Enter your message" value={text} onChangeText={setText} multiline />
        </Block>
        <Button
          gradient={gradients.dark}
          style={{ width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' }}
          onPress={sendMessage}
        >
          <Image source={assets.arrow} width={16} height={16} color={colors.white} transform={[{ rotate: '315deg' }]} />
        </Button>
      </Block>
    </Block>
  );
}
