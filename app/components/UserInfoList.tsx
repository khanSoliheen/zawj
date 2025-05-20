// app/components/UserInfoList.tsx
import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { UserInfoCard } from '.';
import { User } from '../types/user';
import { useTheme } from '../theme/useTheme';


interface UserInfoListProps {
  users: User[];
}

const UserInfoList: React.FC<UserInfoListProps> = ({ users }) => {
  const theme = useTheme();
  
  return (
    <ScrollView 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.list, 
        { backgroundColor: theme.background }
      ]}
    >
      {users.map(user => (
        <UserInfoCard key={user.id} user={user} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  list: { 
    paddingVertical: 32 
  },
});

export default UserInfoList;