// app/components/UserInfoList.tsx
import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { UserInfoCard } from '.';
import { User } from '../types/user';

interface UserInfoListProps {
  users: User[];
}

const UserInfoList: React.FC<UserInfoListProps> = ({ users }) => (
  <ScrollView contentContainerStyle={styles.list}>
    {users.map(user => (
      <UserInfoCard key={user.id} user={user} />
    ))}
  </ScrollView>
);

const styles = StyleSheet.create({
  list: { paddingVertical: 32, backgroundColor: '#fafafa' },
});

export default UserInfoList;