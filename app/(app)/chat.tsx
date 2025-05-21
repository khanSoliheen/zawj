import React from 'react'
import { Text, View } from 'react-native'
import { ChatListItem } from '../components'

export default function Chat() {

  const chatList = [
    {
      id: 'chat1',
      user: {
        id: 'user101',
        name: 'Alice Johnson',
        avatarUri: 'https://randomuser.me/api/portraits/women/1.jpg',
      },
      lastMessage: 'Hey, are we still on for tomorrow?',
      timestamp: '2025-05-20T22:30:00Z', // Yesterday, 10:30 PM
      unreadCount: 2,
    },
  ];
  return (
    <View>
      {chatList.map((chat) => {
      return <ChatListItem chat={chat} />
      })}
    </View>
  )
}

// const styles = StyleSheet.create({})