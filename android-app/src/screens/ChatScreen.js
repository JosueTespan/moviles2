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
    Platform, ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useActiveChat } from "../contexts/ActiveChatContext";
import { useEffect } from "react";
import { getFormatoFecha } from "../utils/formatDate";
import { makeRequest } from "../services/fetchRequest";
import { takePhoto } from "../utils/selectImages";
import { selectFiles } from "../utils/selectFiles";
import ShowFile from "../components/ShowFile";

const userId = 1;

export default function ChatScreen({ route, navigation }) {
    const [mensaje, setMensaje] = useState("");
    const listRef = useRef(null);
    const [nameChat, setNameChat] = useState('');
    const [perfilImage, setPerfilImage] = useState('');
    const { chatId } = route.params;
    const [archivos, setArchivos] = useState([]);

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

        (async () => {
            try {
                const data = await makeRequest(`/chats/mensajes/${chatId}/0/${userId}`);
                setActiveMessages(prev => [...data.data.reverse(), ...prev]);

                setNameChat(`${data.infoChat.nombreUsuario} ${data.infoChat.apellidoUsuario}`);
                setPerfilImage(data.infoChat.imagenUsuario);
            } catch (e) {
            }
        })();

        return () => {
            mounted = false;
            clearActiveChat();
        };
    }, []);

    async function sendMessage() {
        const text = mensaje.trim();
        if (!text && archivos.length == 0) return;

        const mensajeInfo = new FormData();
        mensajeInfo.append('chatId', chatId);
        mensajeInfo.append('usuarioId', userId);
        mensajeInfo.append('mensajeTexto', text);

        const dataMessage = {
            chatId: chatId,
            usuarioId: userId,
            mensajeTexto: text
        }

        if (archivos.length > 0) {
            archivos.forEach(file => {
                mensajeInfo.append('files', {
                    uri: file.uri,
                    name: file.name,
                    type: file.type,
                });
            });
        }

        setMensaje("");
        setArchivos([]);

        try {
            const data = await makeRequest(`/chats/mensaje`, { method: 'post' }, mensajeInfo);

            dataMessage.mensajeId = data.data;
            dataMessage.imagenes = data.files;
            dataMessage.mensajeEnvio = new Date();
        } catch (e) {
            console.log(e);
            return;
        }

        setActiveMessages((prev) => [...prev, dataMessage]);

        setTimeout(() => {
            setActiveMessages((prev) =>
                prev.map((m) => (m.id == dataMessage.mensajeId ? { ...m, seen: true } : m))
            );
        }, 1200);

        requestAnimationFrame(() => {
            listRef.current?.scrollToEnd({ animated: true });
        });
    }

    const removeAt = (idx) => {
        setArchivos(prev => prev.filter((_, i) => i !== idx));
    };

    const isImage = (file) =>
        file.type?.startsWith('image/') ||
        /\.(jpg|jpeg|png|gif|webp|heic|heif)$/i.test(file.name);
        
    const fmtSize = (bytes = 0) => {
        if (bytes < 1024) return `${bytes} B`;
        const kb = bytes / 1024;
        if (kb < 1024) return `${kb.toFixed(1)} KB`;
        const mb = kb / 1024;
        return `${mb.toFixed(1)} MB`;
    };

    const renderMessage = ({ item, index }) => {
        const isMe = item.usuarioId === userId;
        const showTimeInline = true;

        return (
            <View style={[styles.row, isMe ? styles.right : styles.left]}>
                <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
                    <Text style={[styles.text, isMe ? styles.textMe : styles.textOther]}>
                        {item.mensajeTexto}
                    </Text>

                    {Array.isArray(item.imagenes) && item.imagenes.length > 0 && (
                        <View style={styles.attachmentsWrap}>
                            {item.imagenes.map((url, i) => (
                                <ShowFile key={`${url}-${i}`} url={url} />
                            ))}
                        </View>
                    )}

                    <View style={styles.meta}>
                        {showTimeInline && (
                            <Text
                                style={[
                                    styles.time,
                                    isMe ? styles.timeOnPurple : styles.timeOnWhite,
                                ]}
                            >
                                {getFormatoFecha(item.mensajeEnvio)}
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
                <Image source={{ uri: perfilImage }} style={styles.avatar} />

                <View style={styles.headerCenter}>
                    <Text style={styles.name}>{nameChat}</Text>
                    <Text style={styles.role}>En linea</Text>
                </View>
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : 'height'}
                keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
            >
                <FlatList
                    ref={listRef}
                    style={styles.list}
                    contentContainerStyle={{ padding: 16, paddingBottom: 12 }}
                    data={activeMessages}
                    keyExtractor={(it) => it.mensajeId}
                    renderItem={renderMessage}
                    onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
                    onLayout={() => listRef.current?.scrollToEnd({ animated: false })}
                />

                <View>
                    {archivos.length > 0 && (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.filesContent}
                        >
                            {archivos.map((f, idx) => (
                                <View
                                    key={f.uri + idx}
                                    style={styles.viewFile}
                                >
                                    {isImage(f) ? (
                                        <Image
                                            source={{ uri: f.uri }}
                                            style={{ width: 80, height: 80, borderRadius: 8 }}
                                            resizeMode="cover"
                                        />
                                    ) : (
                                        <View
                                            style={{
                                                width: 80, height: 80, borderRadius: 8,
                                                backgroundColor: '#f3f4f6',
                                                alignItems: 'center', justifyContent: 'center'
                                            }}
                                        >
                                            <Text style={{ fontSize: 32 }}>📎</Text>
                                        </View>
                                    )}

                                    <Text
                                        numberOfLines={1}
                                        style={{ marginTop: 6, fontSize: 12, fontWeight: '600', maxWidth: 88 }}
                                    >
                                        {f.name}
                                    </Text>
                                    <Text style={{ fontSize: 11, color: '#6b7280' }}>{fmtSize(f.size)}</Text>

                                    <TouchableOpacity onPress={() => removeAt(idx)} style={{ marginTop: 6 }}>
                                        <Text style={{ color: '#ef4444', fontSize: 12 }}>Quitar</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>
                    )}
                    <View style={styles.inputBar}>
                        <TextInput
                            value={mensaje}
                            onChangeText={setMensaje}
                            placeholder="Escribir un mensaje…"
                            style={styles.input}
                            multiline
                        />

                        <TouchableOpacity style={styles.iconBtn} onPress={() => takePhoto(setArchivos) } >
                            <Ionicons name="image-outline" size={22} />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.iconBtn} onPress={() => selectFiles(setArchivos) } >
                            <MaterialCommunityIcons name="paperclip" size={22} />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.sendBtn} onPress={() => sendMessage(setArchivos) }>
                            <Ionicons name="paper-plane" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
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
    viewFile: {
        width: 100,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 10,
        padding: 6,
        alignItems: 'center'

    },
    filesContent: {
        marginTop: 12,
        backgroundColor: "#fff",
        padding: 5,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: "#e8e8e8",
    },
    attachmentsWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 10
    },
});
