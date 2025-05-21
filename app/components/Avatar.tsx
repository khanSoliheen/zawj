// app/components/Avatar.tsx
import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { useTheme } from '../theme/useTheme';

interface AvatarProps {
  src: string;
  initials: string;
  size: 'small' | 'medium' | 'large' | number;
  alignment?: 'center' | 'left' | 'right'; // might remove
}

const getSize = (size: any): number => {
  if (typeof size === 'number') return size;
  switch (size) {
    case 'small': return 40;
    case 'medium': return 60;
    case 'large': return 200;
    default: return 60;
  }
};


const Avatar: React.FC<AvatarProps> = ({ src, size }) => {
  const theme = useTheme();
  

  const dimension = getSize(size)
  return (
    <View style={[
      styles.avatarContainer,
      {
        borderColor: theme.highlight,
        backgroundColor: theme.card,
        width: dimension,
        height: dimension,
        borderRadius: dimension/2,
      }
    ]}>
      <Image source={{ uri: src }} style={styles.avatarImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    borderWidth: 4,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
});

export default Avatar;