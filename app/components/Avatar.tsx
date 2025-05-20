// app/components/Avatar.tsx
import React from 'react';
import { Image, View, StyleSheet } from 'react-native';

interface AvatarProps {
  src: string;
  borderColor?: string;
  height?: number;
  width?: number;
}

const Avatar: React.FC<AvatarProps> = ({ src, borderColor = '#E74C3C', height = 160, width = 160 }) => (
  <View style={[styles.avatarContainer, { borderColor, height, width }]}>
    <Image source={{ uri: src }} style={styles.avatarImage} />
  </View>
);

const styles = StyleSheet.create({
  avatarContainer: {
    borderRadius: 80,
    borderWidth: 4,
    overflow: 'hidden',
    alignSelf: 'center',
    backgroundColor: '#fff',
    marginVertical: 16,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 80,
  },
});

export default Avatar;