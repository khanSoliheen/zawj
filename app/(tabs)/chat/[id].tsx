// Chat.tsx
import { router } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import { FlatList } from 'react-native';

import { Block, Button, Image, Input, Text } from '@/components';
import { useData } from '@/hooks';

type Sender = 'me' | 'them';
type Message = {
  id: string;
  text: string;
  at: string;   // ISO date
  from: Sender;
  avatar?: any;
};

const seed: Message[] = [
  { id: '1', text: 'Hey there! How are you today? Can we meet and talk about location? Thanks!', at: '2021-06-18T17:09:00.000Z', from: 'them' },
  { id: '2', text: "Sure, just let me finish something and I'll call you.", at: '2021-06-18T17:10:00.000Z', from: 'me' },
  { id: '3', text: 'Ok. Cool! See you 😊', at: '2021-06-18T17:11:00.000Z', from: 'them' },
  { id: '4', text: 'Bye, bye 👋', at: '2021-06-18T17:12:00.000Z', from: 'me' },
];

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

export default function Chat() {
  const { theme } = useData();
  const { colors, sizes, assets, gradients } = theme;
  const [messages, setMessages] = useState<Message[]>(seed);
  const [text, setText] = useState('');
  const listRef = useRef<FlatList<any>>(null);

  const bubbleMaxWidth =
    typeof sizes.width === 'number'
      ? Math.max(0, Math.min(sizes.width * 0.75, sizes.width - sizes.m * 2))
      : undefined;

  // attach avatars from your theme assets
  const meAvatar = assets.avatar2 ?? assets.avatar1;
  const themAvatar = assets.avatar1 ?? assets.avatar2;

  // group by date for the header rows
  const flatData = useMemo(() => {
    const groups: Record<string, Message[]> = {};
    messages.forEach(m => {
      const k = fmtDate(m.at);
      if (!groups[k]) groups[k] = [];
      groups[k].push(m);
    });
    const rows: Array<{ type: 'header'; header: string } | ({ type: 'msg' } & Message)> = [];
    Object.entries(groups)
      .sort((a, b) => new Date(a[1][0].at).getTime() - new Date(b[1][0].at).getTime())
      .forEach(([header, data]) => {
        rows.push({ type: 'header', header });
        data.forEach(m => rows.push({ type: 'msg', ...m }));
      });
    return rows;
  }, [messages]);

  const send = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages(prev => [
      ...prev,
      { id: Math.random().toString(36).slice(2), text: trimmed, at: new Date().toISOString(), from: 'me' },
    ]);
    setText('');
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
  };

  const Bubble = ({ m }: { m: Message }) => {
    const isMe = m.from === 'me';
    return (
      <Block row align="flex-end" justify={isMe ? 'flex-end' : 'flex-start'} marginVertical={sizes.xs}>
        {!isMe && (
          <Image
            source={themAvatar}
            width={sizes.md}
            height={sizes.md}
            radius={sizes.m}
            style={{ marginRight: sizes.s }}
          />
        )}

        <Block
          flex={0}
          paddingHorizontal={sizes.sm}
          paddingVertical={sizes.s}
          style={{
            maxWidth: bubbleMaxWidth,
            backgroundColor: isMe ? colors.dark : colors.white,
            borderRadius: 16,
            ...(isMe
              ? { borderTopRightRadius: 4 }
              : { borderTopLeftRadius: 4, borderWidth: 1, borderColor: '#E5E7EB' }),
          }}
        >
          <Text color={isMe ? colors.white : colors.text}>{m.text}</Text>
        </Block>

        {isMe && (
          <Image
            source={meAvatar}
            width={32}
            height={32}
            radius={16}
            style={{ marginLeft: sizes.s }}
          />
        )}
      </Block>
    );
  };

  const TimeStamp = ({ iso, align }: { iso: string; align: 'left' | 'right' }) => (
    <Text size={sizes.s} color={colors.gray} style={{ textAlign: align }} marginHorizontal={sizes.s} marginTop={sizes.xs}>
      {fmtTime(iso)}
    </Text>
  );

  const DateDivider = ({ title }: { title: string }) => (
    <Block row align="center" marginVertical={sizes.s} paddingHorizontal={sizes.s}>
      <Block flex={1} height={1} color={colors.light} />
      <Text color={colors.gray} marginHorizontal={sizes.s} size={sizes.s}>
        {title}
      </Text>
      <Block flex={1} height={1} color={colors.light} />
    </Block>
  );

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
          const isMe = m.from === 'me';
          return (
            <Block>
              <Bubble m={m} />
              <TimeStamp iso={m.at} align={isMe ? 'right' : 'left'} />
            </Block>
          );
        }}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
        onLayout={() => listRef.current?.scrollToEnd({ animated: false })}
      />
      {/* input bar */}
      <Block
        row
        flex={0}
        align='center'
        style={{
          marginHorizontal: sizes.m,
          marginBottom: sizes.md,
          paddingHorizontal: sizes.s,
          paddingVertical: sizes.s,
        }}
      >
        {/* attach */}
        {/*<Button
          outlined
          gray
          style={{ width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' }}
          onPress={() => { }}
        >
          <Image source={assets.image} width={18} height={18} color={colors.icon} />
        </Button>*/}

        {/* message input */}
        <Block flex={1} marginHorizontal={sizes.s}>
          <Input
            placeholder="Enter your message"
            value={text}
            onChangeText={setText}
            multiline
          />
        </Block>

        {/* send */}
        <Button
          gradient={gradients.dark}
          style={{ width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' }}
          onPress={send}
        >
          {/* reuse arrow as a send icon */}
          <Image source={assets.arrow} width={16} height={16} color={colors.white} transform={[{ rotate: '315deg' }]} />
        </Button>
      </Block>
    </Block >
  );
}
