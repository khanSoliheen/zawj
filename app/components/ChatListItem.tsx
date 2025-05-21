import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { Avatar } from '.';
import { useTheme } from '../theme/useTheme';

export interface ChatPreview {
  id: string;
  user: {
    id: string;
    name: string;
    avatarUri: string;
  };
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
}

interface ChatListItemProps {
  chat: ChatPreview;
}

const ChatListItem: React.FC<ChatListItemProps> = ({ chat }) => {
  const theme = useTheme();

  const handlePress = () => {
    // router.push(`/chat/${chat.id}`);
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: theme.card }
      ]}
      onPress={handlePress}
    >
      <Avatar
        src={chat.user.avatarUri}
        size="small"
        initials={chat.user.name.charAt(0)}
      // alignment='left'
      // fallbackText={chat.user.name.charAt(0)}
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.name, { color: theme.text }]}>
            {chat.user.name}
          </Text>
          <Text style={[styles.timestamp, { color: theme.muted }]}>
            {chat.timestamp}
          </Text>
        </View>
        <View style={styles.footer}>
          <Text
            style={[styles.message, { color: theme.muted }]}
            numberOfLines={1}
          >
            {chat.lastMessage}
          </Text>
          {chat.unreadCount ? (
            <View style={[styles.badge, { backgroundColor: theme.highlight }]}>
              <Text style={styles.badgeText}>
                {chat.unreadCount}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  message: {
    flex: 1,
    fontSize: 14,
    marginRight: 8,
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default ChatListItem;
