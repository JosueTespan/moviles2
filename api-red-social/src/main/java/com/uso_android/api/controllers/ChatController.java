package com.uso_android.api.controllers;

import com.uso_android.api.dtos.ChatDto;
import com.uso_android.api.dtos.ChatRequest;
import com.uso_android.api.dtos.MensajeDto;
import com.uso_android.api.entities.Mensaje;
import com.uso_android.api.services.ChatService;
import com.uso_android.api.services.FcmService;

import lombok.RequiredArgsConstructor;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/chats")
@RequiredArgsConstructor
public class ChatController {
    private final FcmService fcmService;
    private final ChatService chatService;

    @GetMapping("/test")
    public ResponseEntity<?> test() {
        Map<String, String> data = new HashMap<>();
        data.put("message", "funcionando");
        
        return ResponseEntity.ok(data);
    }

    @GetMapping("/listado/{user}/{page}")
    public ResponseEntity<?> getChats(
        @PathVariable Integer user,
        @PathVariable Integer page){

        Map<String, Object> json = new HashMap<>();
        json.put("data", chatService.getChatsUsuario(user, page * 10));
        json.put("message", "");

        return ResponseEntity.ok(json);
    }

    @GetMapping("/mensajes/{chat}/{page}")
    public ResponseEntity<?> getMessages(
        @PathVariable Integer chat,
        @PathVariable Integer page){

        Map<String, Object> json = new HashMap<>();
        json.put("data", chatService.getChatMessages(chat, page * 10));
        json.put("message", "");

        return ResponseEntity.ok(json);
    }

    @PostMapping("/mensaje")
    public ResponseEntity<?> sendChat(MensajeDto mensajeDto) {
        try {
            Mensaje mensaje = chatService.nuevoMensaje(mensajeDto);
            fcmService.sendChatPush(mensaje);
            
            return ResponseEntity.ok(mensaje.getMensajeId());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }
}
