import {
  View,
  Text,
  Button,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import useAuth from "../hooks/useAuth";
import { useTailwind } from "tailwind-rn";
import SafeViewAndroid from "../components/SafeViewAndroid";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import Swiper from "react-native-deck-swiper";
import { collection, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { db } from '../firebase';
import generateId from "../lib/generateid";

const DUMMY_DATA = [
  {
    firstName: "Sonny",
    lastName: "Chang",
    job: "Software Engineer",
    photoURL: "https://media-exp2.licdn.com/dms/image/C5603AQH92oiad2r7mg/profile-displayphoto-shrink_200_200/0/1645595187986?e=1663200000&v=beta&t=U9IUUCapGl90zuFDA0pVGlDipRW9I5-4aFDj0gJA-dE",
    age: 27,
    id: 123,
  },
  {
    firstName: "Elon",
    lastName: "Muskt",
    job: "Software Engineer",
    photoURL: "https://www.biography.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cg_face%2Cq_auto:good%2Cw_300/MTc5OTk2ODUyMTMxNzM0ODcy/gettyimages-1229892983-square.jpg",
    age: 40,
    id: 321,
  },
  {
    firstName: "Sonny",
    lastName: "Chang",
    job: "Software Engineer",
    photoURL: "https://media-exp2.licdn.com/dms/image/C5603AQH92oiad2r7mg/profile-displayphoto-shrink_200_200/0/1645595187986?e=1663200000&v=beta&t=U9IUUCapGl90zuFDA0pVGlDipRW9I5-4aFDj0gJA-dE",
    age: 27,
    id: 345,
  },
];

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const tailwind = useTailwind();
  const [profiles, setProfiles] = useState([]);
  const swipeRef = useRef(null);

  useLayoutEffect(() => {
    return onSnapshot(doc(db, 'users', user.uid), snapshot => {
      if (!snapshot.exists()) {
        navigation.navigate('Modal');
      }
    })

  }, [])
  
  useEffect(() => {
    let unsub;
    const fetchCards = async () => {

      const passes = await getDocs(collection(db, 'users', user.uid, 'passes'))
                      .then(snapshot => snapshot.docs.map(doc => doc.id));

      const swipes = await getDocs(collection(db, 'users', user.uid, 'swipes'))
                      .then(snapshot => snapshot.docs.map(doc => doc.id));

      const pastUserIds = passes.length > 0 ? passes : ['test'];
      const swipedUserIds = swipes.length > 0 ? swipes : ['test'];

      unsub = onSnapshot(
          query(
            collection(db, 'users'),
            where('id', 'not-in', [...pastUserIds, ...swipedUserIds]
          )
        ), snapshot => { 
        setProfiles(
          snapshot.docs.filter(doc => doc.id !== user.uid).map(doc => ({
            id: doc.id,
            ...doc.data(),
          }))
        )
      })

    }

    fetchCards();
    return unsub;
  }, [])

  const swipeLeft = async(cardIndex) => {
    if (!profiles[cardIndex]) return;

    const userSwiped = profiles[cardIndex];
    console.log(`You swiped PASS on ${userSwiped.displayName}`);
    setDoc(doc(db, 'users', user.uid, 'passes', userSwiped.id), userSwiped)

  }

  const swipeRight = async(cardIndex) => {
    if (!profiles[cardIndex]) return;

    const userSwiped = profiles[cardIndex];
    const loggedInProfile = await( await getDoc(doc(db, 'users', user.uid))).data();

    setDoc(doc(db, 'users', user.uid, 'swipes', userSwiped.id), userSwiped)      

    // check if user already swiped on you
    getDoc(doc(db, 'users', userSwiped.id, 'swipes', user.uid)).then(
      (documentSnapshot) => {
        if (documentSnapshot.exists) {
          console.log(`Hooray, You matched with ${userSwiped.displayName}`);

          // create a match
          setDoc(doc(db, 'matches', generateId(user.uid, userSwiped.id)), {
            users: {
              [user.uid]: loggedInProfile,
              [userSwiped.id]: userSwiped,

            },
            usersMatched: [user.uid, userSwiped.id],
            timestamp: serverTimestamp(),
          });
          
          navigation.navigate('Match', {
            loggedInProfile,
            userSwiped,
          })
        } else {
          console.log(`You swiped MATCH on ${userSwiped.displayName}`);
        }
      }
    )

  }

  return (
    <SafeAreaView style={SafeViewAndroid.AndroidSafeArea}>
      <View style={tailwind("flex-row items-center justify-between px-5")}>
        <TouchableOpacity onPress={logout}>
          <Image
            style={tailwind("h-10 w-10 rounded-full")}
            source={{ uri: user.photoURL }}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Modal")}>
          <Image
            style={tailwind("h-14 w-14 rounded-full")}
            source={require("../../assets/tinder.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
          <Ionicons name="chatbubbles-sharp" size={30} color="#FF5864" />
        </TouchableOpacity>
      </View>

      <View style={tailwind("flex-1 -mt-6")}>
        <Swiper
          ref={swipeRef}
          cards={profiles}
          stackSize={5}
          cardIndex={0}
          verticalSwipe={false}
          animateCardOpacity
          onSwipedLeft={(cardIndex) => {
            swipeLeft(cardIndex)
          }}
          onSwipedRight={(cardIndex) => {
            swipeRight(cardIndex)
          }}
          backgroundColor="#4FD0E9"
          overlayLabels={{
            left: {
              title: 'NOPE',
                style: {
                  label: {
                    textAlign: 'right',
                    color: 'red',
                  },
                }
              },
              right: {
              title: 'MATCH',
                style: {
                  label: {
                    color: '#4DED30',
                  },
                }
              },
            }}
          containerStyle={{backgroundColor: 'transparent'}}
          renderCard={(card) => card ? (
            <View key={card.id} style={tailwind("bg-white h-3/4 rounded-xl")}>
              <Image 
                source={{ uri: card.photoURL }} 
                style={tailwind("absolute top-0 w-full h-full rounded-xl")}
              />
              <View 
                style={[tailwind(
                  "flex-row absolute items-center bottom-0 bg-white w-full h-20 justify-between px-6 py-2 rounded-b-xl"
                  ), styles.cardShadow]}
              >
                <View>
                  <Text style={tailwind("text-xl font-bold")}>{card.displayName}</Text>
                  <Text>{card.job}</Text>
                </View>
                <Text style={tailwind("text-2xl font-bold")}>{card.age}</Text>
              </View>
            </View>
          ) : (
            <View 
            style={[tailwind(
              "relative bg-white h-3/4 rounded-xl justify-center items-center"
              ), styles.cardShadow]}
          >
          <Text style={tailwind("font-bold pb-5")}>No more profiles</Text>
              <Image
                style={tailwind("h-20 w-20")}
                height={100}
                width={100}
                source={{uri: "https://links.papareact.com/6gb"}}
              />
            </View>
          )} 
        />
      </View>
      <View style={tailwind("flex flex-row justify-evenly")}>
          <TouchableOpacity
            onPress={() => swipeRef.current.swipeLeft()}
            style={tailwind("items-center justify-center rounded-full w-16 h-16 bg-red-200")}
          >
            <Entypo name="cross" size={24} color="red" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => swipeRef.current.swipeRight()}
            style={tailwind("items-center justify-center rounded-full w-16 h-16 bg-green-200")} 
          >
            <AntDesign name="heart" size={24} color="green" />
          </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

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


export default HomeScreen;
