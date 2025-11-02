package com.uso_android.api.controllers;

import com.uso_android.api.dtos.ChatDto;
import com.uso_android.api.dtos.MensajeDto;
import com.uso_android.api.entities.Mensaje;
import com.uso_android.api.services.ChatService;
import com.uso_android.api.services.FcmService;

import lombok.RequiredArgsConstructor;

import java.util.HashMap;
import java.util.Map;
import org.springframework.http.MediaType;

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

    @GetMapping("/mensajes/{chat}/{page}/{user}")
    public ResponseEntity<?> getMessages(
        @PathVariable Integer chat,
        @PathVariable Integer page,
        @PathVariable Integer user){

        ChatDto infoChat = chatService.getInfoChat(chat);

        if(infoChat.getUsuarioId1() == user){
            infoChat.setNombreUsuario(infoChat.getNombreUsuario1());
            infoChat.setApellidoUsuario(infoChat.getApellidoUsuario1());
            infoChat.setImagenUsuario(infoChat.getImagenUsuario1());
        }
        
        infoChat.setImagenUsuario1(null);
        infoChat.setNombreUsuario1(null);
        infoChat.setApellidoUsuario1(null);
        infoChat.setUsuarioId1(null);

        Map<String, Object> json = new HashMap<>();
        json.put("data", chatService.getChatMessages(chat, page * 10));
        json.put("infoChat", infoChat);
        json.put("message", "");

        return ResponseEntity.ok(json);
    }

    @PostMapping(value = "/mensaje", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> sendChat(@ModelAttribute MensajeDto mensajeDto) {
        try {
            Mensaje mensaje = chatService.nuevoMensaje(mensajeDto);
            fcmService.sendChatPush(mensaje);
            
            Map<String, Object> json = new HashMap<>();
            json.put("data", mensaje.getMensajeId());
            json.put("files", mensajeDto.getImagenes());
            json.put("chatId", mensaje.getChat().getChatId());
            json.put("message", "");
            
            return ResponseEntity.ok(json);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }
}
