import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import getMatchedUserInfo from '../lib/getMatchedUserInfo';
import { useTailwind } from 'tailwind-rn/dist';
import useAuth from '../hooks/useAuth';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';

const ChatRow = ({matchDetails}) => {
    const tw = useTailwind();
    const navigation = useNavigation();
    const {user} = useAuth();
    const [matchedUserInfo, setMatchedUserInfo] = useState(null);
    const [lastMessage, setLastMessage] = useState('');

    useEffect(
      () => 
        onSnapshot(
          query(
            collection(db, 'matches', matchDetails.id, 'messages'),
            orderBy('timestamp', 'desc')
          ),snapshot => setLastMessage(snapshot.docs[0]?.data()?.message)
      
      ), [matchDetails, db])

    console.log('matchDetails.id', matchDetails.id)
    console.log('lastMessage', lastMessage)

    useEffect(() => {
        setMatchedUserInfo(getMatchedUserInfo(user, matchDetails.users));
    }, [matchDetails, user])

  return (
    <TouchableOpacity 
        style={[
            tw("flex-row items-center py-3 px-5 bg-white mx-3 rounded-lg"),
            styles.cardShadow
        ]}
        onPress={() => navigation.navigate('Message', {
          matchDetails: matchDetails,
        })}
    >
      <Image 
        style={tw("rounded-full h-16 w-16 mr-4")}
        source={{uri: matchedUserInfo?.photoURL}}
      />
      <View>
        <Text style={tw("text-lg font-semibold")}>
            {matchedUserInfo?.displayName}
        </Text>
        <Text>{ lastMessage ||  'Say Hi!'}</Text>
      </View>
    </TouchableOpacity>
  )
}
const styles = StyleSheet.create({
    cardShadow: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
    }
  });
  

export default ChatRow