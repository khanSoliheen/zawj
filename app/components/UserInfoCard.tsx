// app/components/UserInfoCard.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

import { Avatar, UserDetails } from '.';
import { useTheme } from '../theme/useTheme';
import { User } from '../types/user';

interface UserInfoCardProps {
  user: User;
}

const UserInfoCard: React.FC<UserInfoCardProps> = ({ user }) => {
  const theme = useTheme();
  const [liked, setLiked] = useState(false);

  // Placeholder for connect action
  const handleConnect = () => {
    // TODO: Implement navigation to chat screen
    // For now, just log
  };

  return (
    <View style={[
      styles.card,
      {
        backgroundColor: theme.card,
        borderColor: theme.border,
        marginVertical: 32,
      }
    ]}>
      <Avatar src={user.avatarUrl} size="large" initials={`${user.firstName.substring(0, 1)}${user.lastName.substring(0, 1)}`} />
      <UserDetails firstNameInitial={user.firstName.substring(0, 1)} lastName={user.lastName} bio={user.bio} />
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setLiked(l => !l)}
        >
          <Ionicons
            name={liked ? 'heart' : 'heart-outline'}
            size={28}
            color={liked ? theme.highlight : theme.muted}
          />
          <Text style={{ color: liked ? theme.highlight : theme.muted, marginLeft: 6 }}>
            Like
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleConnect}
        >
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={28}
            color={theme.primary}
          />
          <Text style={{ color: theme.primary, marginLeft: 6 }}>
            Connect
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
});

export default UserInfoCard;
