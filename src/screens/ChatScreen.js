import React, { useMemo, useRef, useState } from "react";
import {
    View,
    Text,
    FlatList,
    Image,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useActiveChat } from "../contexts/ActiveChatContext";
import { useEffect } from "react";
import { setActiveChatId } from "../utils/notificationsState";

const USER_ME = "me";
const USER_OTHER = "other";

const AVATAR_OTHER =
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&q=60";

const initialMessages = [
    {
        id: "m0",
        text: "Primer mensaje.",
        createdAt: "1:45 AM",
        sender: USER_OTHER,
        seen: true,
    },
    {
        id: "m1",
        text: "Primera respuesta",
        createdAt: "1:46 AM",
        sender: USER_ME,
        seen: true,
    },
    {
        id: "m2",
        text: "Mas texto adicional al mensaje inicial!",
        createdAt: "1:46 AM",
        sender: USER_ME,
        seen: true,
    },
    {
        id: "m3",
        text: "Pues se ve que si funciona",
        createdAt: "1:46 AM",
        sender: USER_OTHER,
        seen: true,
    },
    {
        id: "m4",
        text: "Ya solo falta agregarlo a la api",
        createdAt: "1:47 AM",
        sender: USER_OTHER,
        seen: true,
    },
];

export default function ChatScreen({ route, navigation }) {
    const [messages, setMessages] = useState(initialMessages);
    const [draft, setDraft] = useState("");
    const listRef = useRef(null);
    const { chatId } = route.params;

    const {
        setActiveChatId,
        clearActiveChat,
        activeMessages,
        setActiveMessages,
    } = useActiveChat();

    useEffect(() => {
        setActiveChatId(chatId);
        return () => setActiveChatId(null);
    }, [chatId]);

    useEffect(() => {
        let mounted = true;
        setActiveChatId(chatId);

        (async () => {
            try {
                //const msgs = await fetchLastMessages(chatId, 10);
                /* if (mounted) */ setActiveMessages(initialMessages);
                //markChatRead(chatId);
            } catch (e) { /* log/ignore */ }
        })();

        return () => {
            mounted = false;
            clearActiveChat();
        };
    }, [chatId]);

    const data = useMemo(() => [...messages], [messages]);

    function sendMessage() {
        const text = draft.trim();
        if (!text) return;

        const newMsg = {
            id: String(Date.now()),
            text,
            createdAt: new Date().toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
            }),
            sender: USER_ME,
            seen: false,
        };
        setActiveMessages((prev) => [...prev, newMsg]);
        setDraft("");

        setTimeout(() => {
            setActiveMessages((prev) =>
                prev.map((m) => (m.id === newMsg.id ? { ...m, seen: true } : m))
            );
        }, 1200);

        requestAnimationFrame(() => {
            listRef.current?.scrollToEnd({ animated: true });
        });
    }

    const renderItem = ({ item, index }) => {
        const isMe = item.sender === USER_ME;
        const showTimeInline = true;

        return (
            <View style={[styles.row, isMe ? styles.right : styles.left]}>
                <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
                    <Text style={[styles.text, isMe ? styles.textMe : styles.textOther]}>
                        {item.text}
                    </Text>

                    <View style={styles.meta}>
                        {showTimeInline && (
                            <Text
                                style={[
                                    styles.time,
                                    isMe ? styles.timeOnPurple : styles.timeOnWhite,
                                ]}
                            >
                                {item.createdAt}
                            </Text>
                        )}
                        {isMe && (
                            <View style={styles.seenWrap}>
                                <Feather
                                    name="check"
                                    size={12}
                                    style={[styles.check, item.seen && styles.checkSeen]}
                                />
                                <Feather
                                    name="check"
                                    size={12}
                                    style={[
                                        styles.check,
                                        styles.checkOverlap,
                                        item.seen && styles.checkSeen,
                                    ]}
                                />
                            </View>
                        )}
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.menuBtn} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={22} />
                </TouchableOpacity>
                <Image source={{ uri: AVATAR_OTHER }} style={styles.avatar} />

                <View style={styles.headerCenter}>
                    <Text style={styles.name}>Yohalmo Vasquez</Text>
                    <Text style={styles.role}>En linea</Text>
                </View>
            </View>

            <FlatList
                ref={listRef}
                style={styles.list}
                contentContainerStyle={{ padding: 16, paddingBottom: 12 }}
                data={activeMessages}
                keyExtractor={(it) => it.id}
                renderItem={renderItem}
                onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
                onLayout={() => listRef.current?.scrollToEnd({ animated: false })}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
            >
                <View style={styles.inputBar}>
                    <TouchableOpacity>
                        <Ionicons name="happy-outline" size={22} />
                    </TouchableOpacity>

                    <TextInput
                        value={draft}
                        onChangeText={setDraft}
                        placeholder="Type your message…"
                        style={styles.input}
                        multiline
                    />

                    <TouchableOpacity style={styles.iconBtn}>
                        <Ionicons name="image-outline" size={22} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.iconBtn}>
                        <MaterialCommunityIcons name="paperclip" size={22} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
                        <Ionicons name="paper-plane" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const PURPLE = "#7C4DFF";
const BG = "#F6F7FB";

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: BG },
    header: {
        height: 64,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#e6e6e6",
        backgroundColor: "#fff",
    },
    menuBtn: { width: 36, alignItems: "center" },
    moreBtn: { width: 36, alignItems: "center" },
    headerCenter: { flex: 1, alignItems: "center" },
    name: { fontSize: 16, fontWeight: "700", color: "#222" },
    role: { fontSize: 12, color: "#33bd13ff", marginTop: 2 },

    list: { flex: 1 },

    row: {
        flexDirection: "row",
        alignItems: "flex-end",
        marginBottom: 12,
    },
    left: { justifyContent: "flex-start" },
    right: { justifyContent: "flex-end" },

    avatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        marginRight: 8,
    },
    avatarMe: {
        width: 24,
        height: 24,
        borderRadius: 12,
        marginLeft: 6,
        opacity: 0.85,
    },

    bubble: {
        maxWidth: "75%",
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 16,
    },
    bubbleOther: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 6,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#ECECEC",
    },
    bubbleMe: {
        backgroundColor: PURPLE,
        borderTopRightRadius: 6,
    },

    text: { fontSize: 15, lineHeight: 20 },
    textOther: { color: "#222" },
    textMe: { color: "#fff" },

    meta: {
        marginTop: 6,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    time: { fontSize: 11 },
    timeOnPurple: { color: "rgba(255,255,255,0.85)" },
    timeOnWhite: { color: "#9A9AA1" },

    seenWrap: { flexDirection: "row", alignItems: "center" },
    check: { marginLeft: 2, color: "rgba(255,255,255,0.6)" },
    checkOverlap: { marginLeft: -4 },
    checkSeen: { color: "#CDE7FF" },

    inputBar: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: "#e8e8e8",
        backgroundColor: "#fff",
    },
    input: {
        flex: 1,
        minHeight: 40,
        maxHeight: 110,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 18,
        backgroundColor: "#F1F2F6",
    },
    iconBtn: { padding: 4 },
    sendBtn: {
        paddingVertical: 10,
        paddingHorizontal: 14,
        backgroundColor: PURPLE,
        borderRadius: 16,
    },
});
