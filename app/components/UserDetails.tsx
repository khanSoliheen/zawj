// app/components/UserDetails.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/useTheme';


interface UserDetailsProps {
  // firstName: string;
  lastName: string;
  bio: string;
  firstNameInitial: string;
}

const UserDetails: React.FC<UserDetailsProps> = ({ lastName, firstNameInitial, bio }) => {
  const theme = useTheme();
  
  return (
    <View style={styles.container}>
      <Text style={[styles.name, { color: theme.text }]}>{firstNameInitial} {lastName}</Text>
      <Text style={[styles.bio, { color: theme.muted }]}>{bio}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginTop: 8 },
  name: { fontSize: 22, fontWeight: '500', marginBottom: 8 },
  genderBadge: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 12,
  },
  genderText: { fontSize: 14 },
  bio: { fontSize: 15, marginTop: 12, textAlign: 'center' },
});

export default UserDetails;