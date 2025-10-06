import React from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";

const DUMMY_CHATS = [
    { id: "abc123", title: "General" },
    { id: "dev42", title: "Desarrollo" },
    { id: "ventas77", title: "Ventas" },
];

export default function ChatsScreen() {
    const navigation = useNavigation();

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 8 }}>Mis chats</Text>
            <FlatList
                data={DUMMY_CHATS}
                keyExtractor={(i) => i.id}
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() => navigation.navigate("Chat", { chatId: item.id })}
                        style={{
                            padding: 12,
                            backgroundColor: "#f1f5f9",
                            borderRadius: 12,
                            marginBottom: 8,
                        }}
                    >
                        <Text style={{ fontSize: 16 }}>{item.title}</Text>
                        <Text style={{ color: "#64748b" }}>ID: {item.id}</Text>
                    </Pressable>
                )}
            />
        </View>
    );
}
