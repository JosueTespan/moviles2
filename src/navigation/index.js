import React from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatsScreen from "../screens/ChatsScreen";
import ChatScreen from "../screens/ChatScreen";
import { ActiveChatProvider } from "../contexts/ActiveChatContext";
import NotificationListener from "../services/NotificationListener";

const Stack = createNativeStackNavigator();


export default function Navigation() {
    return (
        <NavigationContainer>
            <ActiveChatProvider>
                <NotificationListener />
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Chats" component={ChatsScreen} />
                    <Stack.Screen name="Chat" component={ChatScreen} />
                </Stack.Navigator>
            </ActiveChatProvider>
        </NavigationContainer>
    );
}
