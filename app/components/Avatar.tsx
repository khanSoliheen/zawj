// app/components/Avatar.tsx
import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { useTheme } from '../theme/useTheme';

interface AvatarProps {
  src: string;
  borderColor?: string;
  height?: number;
  width?: number;
}

const Avatar: React.FC<AvatarProps> = ({ src, borderColor, height = 160, width = 160 }) => {
  const theme = useTheme();
  
  return (
    <View style={[
      styles.avatarContainer,
      {
        borderColor: borderColor || theme.highlight,
        height,
        width,
        backgroundColor: theme.card
      }
    ]}>
      <Image source={{ uri: src }} style={styles.avatarImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    borderRadius: 80,
    borderWidth: 4,
    overflow: 'hidden',
    alignSelf: 'center',
    marginVertical: 16,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 80,
  },
});

export default Avatar;