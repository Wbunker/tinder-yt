import { Image, StyleSheet, Text, TextInput, Touchable, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import SafeViewAndroid from '../components/SafeViewAndroid'
import { useTailwind } from "tailwind-rn";
import useAuth from '../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const ModalScreen = () => {
    const tailwind = useTailwind();
    const navigation = useNavigation();
    const {user} = useAuth();
    const [image, setImage] = useState(null)
    const [job, setJob] = useState(null)
    const [age, setAge] = useState(null)

    const incompleteForm = !image || !job || !age


    const updateUserProfile = () => {
        setDoc(doc(db, 'users', user.uid), {
            id: user.uid,
            displayName: user.displayName,
            photoURL: image,
            job: job,
            age: age,
            timestamp: serverTimestamp()
        }).then(() => {
            navigation.navigate('Home');
        }).catch(error => alert(error.message))
    }

    return (
    <SafeAreaView style={[SafeViewAndroid.AndroidSafeArea, tailwind("items-center pt-1")]}>
      <Image
        style={tailwind("h-20 w-full")}
        resizeMode="contain"
        source={{uri: "https://links.papareact.com/2pf"}}
      />
      <Text style={tailwind("text-xl text-gray-500 p-2 font-bold")}>
        Welcome {user.displayName}
     </Text>

     <Text style={tailwind("text-center p-4 font-bold text-red-400")}>
        Step 1: The Profile Pic
     </Text>
     <TextInput
     value={image}
     onChangeText={(text) => setImage(text)}
     style={tailwind("text-center text-xl pb-2")}
       placeholder='Enter your profile pic url'
     />

    <Text style={tailwind("text-center p-4 font-bold text-red-400")}>
        Step 2: The Job
    </Text>
    <TextInput
    value={job}
    onChangeText={(text) => setJob(text)}
     style={tailwind("text-center text-xl pb-2")}
       placeholder='Enter your occupation'
    />

     <Text style={tailwind("text-center p-4 font-bold text-red-400")}>
        Step 3: The Age
     </Text>
     <TextInput
     value={age}
     onChangeText={(text) => setAge(text)}
     maxLength={2}
     keyboardType='numeric'
     style={tailwind("text-center text-xl pb-2")}
       placeholder='Enter your age'
     />

     <TouchableOpacity 
        disabled={incompleteForm}
        style={[tailwind("w-64 p-3 rounded-xl absolute bottom-10"),
        incompleteForm ? tailwind("bg-gray-400") : tailwind("bg-red-400")]}
        onPress={updateUserProfile}
     >
        <Text style={tailwind("text-center text-white text-xl")}>Update Profile</Text>
     </TouchableOpacity>
    </SafeAreaView>
  )
}

export default ModalScreen

const styles = StyleSheet.create({})