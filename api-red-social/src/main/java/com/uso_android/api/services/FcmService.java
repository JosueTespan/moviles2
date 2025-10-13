package com.uso_android.api.services;

import com.uso_android.api.dtos.ChatRequest;

import org.springframework.stereotype.Service;
import com.google.firebase.messaging.*;

@Service
public class FcmService {

    public String sendChatPush(ChatRequest chat) throws Exception {
        AndroidConfig android = AndroidConfig.builder()
                .setPriority(AndroidConfig.Priority.HIGH) 
                .setCollapseKey("chat_" + chat.getChatId())
                .setNotification(AndroidNotification.builder()
                        .setChannelId("default")
                        .build())
                .build();

        Notification notif = Notification.builder()
                .setTitle(chat.getSenderName())
                .setBody(chat.getText())
                .build();

        Message msg = Message.builder()
                .setTopic("usuario10")
                .setAndroidConfig(android)
                .setNotification(notif)
                .putData("type", "chat_message")
                .putData("chatId", chat.getChatId())
                .putData("messageId", chat.getMessageId())
                .putData("senderId", chat.getSenderName())
                .putData("senderName", chat.getSenderName())
                .putData("text", chat.getText())
                .putData("ts", String.valueOf(System.currentTimeMillis()))
                .build();

        return FirebaseMessaging.getInstance().send(msg);
    }
}
