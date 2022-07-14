import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import SafeViewAndroid from '../components/SafeViewAndroid'
import Header from '../components/Header'
import ChatList from '../components/ChatList'
import { useTailwind } from "tailwind-rn";

const ChatScreen = () => {


  return (
    <SafeAreaView style={SafeViewAndroid.AndroidSafeArea}>
      <Header title="Chat" callEnabled />
      <ChatList />
    </SafeAreaView>
  )
}

export default ChatScreen