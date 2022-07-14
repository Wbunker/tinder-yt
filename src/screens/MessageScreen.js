import { View, KeyboardAvoidingView, SafeAreaView, TextInput, Button, Platform, TouchableWithoutFeedback, Keyboard, Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import SafeViewAndroid from '../components/SafeViewAndroid'
import getMatchedUserInfo from '../lib/getMatchedUserInfo'
import useAuth from '../hooks/useAuth'
import { useRoute } from '@react-navigation/native'
import { useTailwind } from 'tailwind-rn/dist'
import SenderMessage from '../components/SenderMessage'
import ReceiverMessage from '../components/ReceiverMessage'
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase';

const MessageScreen = () => {

  const tw = useTailwind();
  const { user } = useAuth();
  const {params} = useRoute();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const {matchDetails} = params;

  console.log(messages)
  useEffect(() => onSnapshot(
      query(
        collection(db, 'matches', matchDetails.id, 'messages'), 
        orderBy('timestamp', 'desc')
      ), snapshot => setMessages(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })))
    ), [])


  const sendMessage = () => {
    addDoc(collection(db, 'matches', matchDetails.id, 'messages'),{
      timestamp: serverTimestamp(),
      userId: user.uid,
      displayName: user.displayName,
      photoURL: matchDetails.users[user.uid].photoURL,
      message: input,
    })
    setInput('')
  }

  return (
    <SafeAreaView style={SafeViewAndroid.AndroidSafeArea}>
        <Header title={getMatchedUserInfo(user.uid, matchDetails.users).displayName} callEnabled />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={tw('flex-1')}
        keyboardVerticalOffset={10}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>

          <FlatList
            data={messages}
            inverted={-1}
            style={tw('pl-4')}
            keyExtractor={(item) => item.id}
            renderItem={({ item: message }) => message.id === user.uid ? (
              <SenderMessage key={message.id} message={message} />
            ) : (
              <ReceiverMessage key={message.id} message={message} />
            )}
          />
        </TouchableWithoutFeedback>


      <View
        style={tw('flex-row items-center justify-between border-t border-gray-200 px-5 py-2 bg-white')}
      >
        <TextInput
          style={tw("h-10 text-lg")}
          placeholder="Send message..."
          onChangeText={setInput}
          onSubmitEditing={sendMessage}
          value={input}
        />
        <Button title='Send' onPress={sendMessage} color="#FF5864" />
      </View>

    </KeyboardAvoidingView>
     
    </SafeAreaView>
  )
}

export default MessageScreen