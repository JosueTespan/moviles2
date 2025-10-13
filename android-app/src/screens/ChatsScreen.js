import React from "react";
import { View, Text, FlatList, Pressable, StyleSheet, Image, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomTabBarHeightCallbackContext } from "@react-navigation/bottom-tabs";

const DUMMY_CHATS = [
    { id: "chatYohalmo", title: "Yohalmo", lastMessage:"Este es el ultimo mensaje que se envio" },
    { id: "chatHants", title: "Hants", lastMessage:"Este es el ultimo mensaje que se envio" },
    { id: "chatArmando", title: "Armando", lastMessage:"Este es el ultimo mensaje que se envio" },
    { id: "chatJouse", title: "Josue", lastMessage:"Este es el ultimo mensaje que se envio" },
];

const AVATAR_OTHER = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&q=60";

export default function ChatsScreen() {
    const navigation = useNavigation();

    return (
        <SafeAreaView>
            <View style={styles.contentPage}>
                <Text style={styles.title}>Mis chats</Text>

                <View style={styles.searcher}>
                    <TextInput
                        placeholderTextColor="#9AA0A6" 
                        style={styles.input} 
                        placeholder="Buscar chat"></TextInput>
                </View>

                <FlatList
                    data={DUMMY_CHATS}
                    keyExtractor={(i) => i.id}
                    renderItem={({ item }) => (
                        <Pressable
                            onPress={() => navigation.navigate("Chat", { chatId: item.id, nameChat: item.title })}
                        >
                            <View style={styles.card}>
                                <Image source={{ uri: AVATAR_OTHER }} style={styles.avatar} />

                                <View style={styles.content}>

                                    <View style={styles.topRow}>
                                        <Text
                                            style={styles.name}
                                            numberOfLines={1}
                                            ellipsizeMode="tail"
                                        >
                                            {item.title}
                                        </Text>

                                        <Text style={styles.time} numberOfLines={1}>
                                            Hace 3 dias
                                        </Text>
                                    </View>

                                    <Text
                                        style={styles.preview}
                                        numberOfLines={1}
                                        ellipsizeMode="tail"
                                    >
                                        {item.lastMessage}
                                    </Text>
                                </View>
                            </View>
                        </Pressable>
                    )}
                />
            </View>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        marginBottom: 12,
        backgroundColor: '#fff',
        borderRadius: 18,
        width: '100%',
        elevation: 1,
    },
    avatar: { width: 56, height: 56, borderRadius: 28, marginRight: 12 },

    content: {
        flex: 1,
        minWidth: 0,
    },

    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    name: {
        flex: 1,
        minWidth: 0,
        fontSize: 16,
        fontWeight: '700',
        color: '#1b1b1b',
        marginRight: 8,
    },

    time: {
        flexShrink: 0,
        color: '#9aa0a6',
        fontSize: 12,
    },

    preview: {
        marginTop: 6,
        color: '#5f6368',
        fontSize: 14,
    },
    searcher: {
        backgroundColor: "#fff",
        marginBottom: 20,
        padding: 5,
        borderRadius: 10
    },
    contentPage: {
        padding: 20,
    },
    title: {
        fontSize: 25,
        fontWeight: "bold",
        marginBottom: 5
    },
    input: {
        color: "#000",
        backgroundColor: "#f5f5f5",
        borderBottomColor: "#000000",
        paddingLeft: 10,
        paddingRight: 10
    },
});

