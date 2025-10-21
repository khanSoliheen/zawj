// components/AcceptMessage.tsx
import React from "react";
import { Pressable } from "react-native";

import { Modal, Block, Button, Text } from "@/components";
import { useData } from "@/hooks";

type Props = {
  visible: boolean;
  message?: string;
  actionLabel?: string;
  onAction: () => void;
  onClose?: () => void;
  onDecline?: () => void;
  loading?: boolean;
};

export default function AcceptMessage({
  visible,
  message = "Accept message request?",
  actionLabel = "Accept",
  onAction,
  onDecline,
  onClose,
  loading = false,
}: Props) {
  const { theme } = useData();
  const { colors, sizes } = theme;

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.35)" }} onPress={onClose} />
      <Block
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        color={colors.card}
        paddingHorizontal={sizes.padding}
        paddingVertical={sizes.m}
        radius={16}
        shadow
      >
        <Block align="center" paddingVertical={sizes.s}>
          <Text h5 semibold center>{message}</Text>
        </Block>

        <Button onPress={onAction} disabled={loading} marginTop={sizes.s}>
          <Block row align="center" justify="center" paddingVertical={sizes.s}>
            <Text p semibold color={colors.primary}>{loading ? "Please wait…" : actionLabel}</Text>
          </Block>
        </Button>

        {onDecline && (
          <Button onPress={onDecline} marginTop={sizes.xs}>
            <Block row align="center" justify="center" paddingVertical={sizes.s}>
              <Text p>Decline</Text>
            </Block>
          </Button>
        )}

        <Button onPress={onClose} marginTop={sizes.s}>
          <Block row align="center" justify="center" paddingVertical={sizes.s}>
            <Text p color={colors.link}>Cancel</Text>
          </Block>
        </Button>
      </Block>
    </Modal>
  );
}
