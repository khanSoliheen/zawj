import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { StyleSheet, Text, View, ScrollView, TextInput, Pressable } from 'react-native'

import { useTheme } from '../../theme/useTheme'


interface Message {
  id: string
  text: string
  sender: 'user' | 'other'
  timestamp: Date
}

const ChatScreen = () => {
  const theme  = useTheme()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Assalamu alaikum! How are you?',
      sender: 'other',
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: '2',
      text: 'Wa alaikum assalam! I am doing well, thank you. How about you?',
      sender: 'user',
      timestamp: new Date(Date.now() - 3500000),
    },
  ])
  const [newMessage, setNewMessage] = useState('')

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage.trim(),
        sender: 'user',
        timestamp: new Date(),
      }
      setMessages([...messages, message])
      setNewMessage('')
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView 
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageBubble,
              message.sender === 'user' ? styles.userMessage : styles.otherMessage,
              { backgroundColor: message.sender === 'user' ? theme.primary : theme.card }
            ]}
          >
            <Text
              style={[
                styles.messageText,
                { color: message.sender === 'user' ? theme.button.text : theme.text }
              ]}
            >
              {message.text}
            </Text>
            <Text
              style={[
                styles.timestamp,
                { color: message.sender === 'user' ? theme.button.text : theme.muted }
              ]}
            >
              {formatTime(message.timestamp)}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={[styles.inputContainer, { backgroundColor: theme.card }]}>
        <TextInput
          style={[styles.input, { color: theme.text }]}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor={theme.muted}
          multiline
        />
        <Pressable
          onPress={sendMessage}
          style={[styles.sendButton, { backgroundColor: theme.primary }]}
        >
          <Ionicons name="send" size={24} color={theme.button.text} />
        </Pressable>
      </View>
    </View>
  )
}

export default ChatScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    gap: 12,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginVertical: 4,
  },
  userMessage: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
})