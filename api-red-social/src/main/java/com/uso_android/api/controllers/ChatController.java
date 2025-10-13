package com.uso_android.api.controllers;

import com.uso_android.api.dtos.ChatRequest;
import com.uso_android.api.services.FcmService;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/chat")
public class ChatController {
    private final FcmService fcmService;

    public ChatController(FcmService fcm) {
        this.fcmService = fcm;
    }

    @GetMapping("/test")
    public ResponseEntity<?> test() {
        Map<String, String> data = new HashMap<>();
        data.put("message", "funcionando");
        
        return ResponseEntity.ok(data);
    }

    @PostMapping("/chat")
    public ResponseEntity<?> sendChat(@RequestBody ChatRequest chatRequest) {
        try {
            String id = fcmService.sendChatPush(chatRequest);
            return ResponseEntity.ok(id);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }
}
