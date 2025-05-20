// app/components/UserInfoCard.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, UserDetails } from '.';
import { User } from '../types/user';

interface UserInfoCardProps {
  user: User;
}

const UserInfoCard: React.FC<UserInfoCardProps> = ({ user }) => (
  <View style={styles.card}>
    <Avatar src={user.avatarUrl} />
    <UserDetails name={user.name} gender={user.gender} bio={user.bio} />
  </View>
);

const styles = StyleSheet.create({
  card: { marginVertical: 32 },
});

export default UserInfoCard;