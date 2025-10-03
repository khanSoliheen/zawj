import React, { useMemo } from 'react';

import { Message } from '@/(tabs)/chat/[id]';
import { Block, Image, Text } from '@/components';
import { useData } from '@/hooks';

type Props = {
  m: Message;
  userId: string | null | undefined;
  meAvatar: any;
  themAvatar: any;
};

export default function Bubble({ m, userId, meAvatar, themAvatar }: Props) {
  const { theme } = useData();
  const { sizes, colors } = theme;

  // --- normalize ids & fields ---
  const senderId = useMemo(() => String(m?.sender_id ?? '').trim(), [m?.sender_id]);
  const meId = useMemo(() => String(userId ?? '').trim(), [userId]);
  const isMe = senderId.length > 0 && meId.length > 0 && senderId === meId;

  const text = m?.text ?? (m as any)?.content ?? ''; // tolerate 'content' or 'text'
  const leftAvatarSrc = m?.avatar ? { uri: m.avatar } : themAvatar;
  const rightAvatarSrc = m?.avatar ? { uri: m.avatar } : meAvatar;

  // Debug once per render

  return (
    <Block row align="flex-end" flex={1} justify={isMe ? 'flex-end' : 'flex-start'} marginVertical={sizes.xs}>
      {!isMe && (
        <Image
          source={leftAvatarSrc}
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
        color={isMe ? colors.facebook : colors.secondary}
        radius={sizes.sm}
        style={{
          maxWidth: sizes.width * 0.75,
          ...(isMe
            ? { borderTopRightRadius: 4 }
            : { borderTopLeftRadius: 4, borderWidth: 1, borderColor: colors.gray }),
        }}
      >
        <Text white>{text}</Text>
      </Block>

      {isMe && (
        <Image
          source={rightAvatarSrc}
          width={32}
          height={32}
          radius={16}
          style={{ marginLeft: sizes.s }}
        />
      )}
    </Block>
  );
}
