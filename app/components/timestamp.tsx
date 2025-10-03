import React from 'react';

import { Text } from '@/components';
import { useData } from '@/hooks';

export default function TimeStamp({ iso, align }: { iso: string; align: 'left' | 'right' }) {
  const { theme } = useData();
  const { sizes, colors } = theme;

  const fmtTime = (iso: string) =>
    new Date(iso).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

  return (
    <Text
      size={sizes.s}
      color={colors.gray}
      style={{ textAlign: align }}
      marginHorizontal={sizes.xl}
      marginTop={sizes.xs}
    >
      {fmtTime(iso)}
    </Text>
  );
}
