import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./screens/HomeScreen";
import ChatScreen from "./screens/ChatScreen";
import LoginScreen from "./screens/LoginScreen";
import useAuth, { AuthProvider } from "./hooks/useAuth";
import ModalScreen from "./screens/ModalScreen";
import MatchScreen from "./screens/MatchScreen";
import MessageScreen from "./screens/MessageScreen";

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  const { user } = useAuth();
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Group>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Chat" component={ChatScreen} />
              <Stack.Screen name="Message" component={MessageScreen} />
            </Stack.Group>
            <Stack.Group screenOptions={{presentation: "modal"}}>
              <Stack.Screen name="Modal" component={ModalScreen} />
            </Stack.Group>
            <Stack.Group screenOptions={{presentation: "transparentModal"}}>
              <Stack.Screen name="Match" component={MatchScreen} />
            </Stack.Group>
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
