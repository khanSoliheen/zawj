// app/components/UserDetails.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface UserDetailsProps {
  name: string;
  gender: 'Male' | 'Female';
  bio: string;
}

const UserDetails: React.FC<UserDetailsProps> = ({ name, gender, bio }) => (
  <View style={styles.container}>
    <Text style={styles.name}>{name}</Text>
    <View style={styles.genderBadge}>
      <Text style={styles.genderText}>{gender}</Text>
    </View>
    <Text style={styles.bio}>{bio}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginTop: 8 },
  name: { fontSize: 22, fontWeight: '500', marginBottom: 8 },
  genderBadge: {
    backgroundColor: '#e3eafe',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 12,
  },
  genderText: { color: '#4a6fa1', fontSize: 14 },
  bio: { color: '#666', fontSize: 15, marginTop: 12, textAlign: 'center' },
});

export default UserDetails;