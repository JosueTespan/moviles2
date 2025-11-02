package com.uso_android.api.controllers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uso_android.api.services.PushTopicsService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/usuarios")
public class UsuarioController {
    private final PushTopicsService pushTopicsService;
    
    @GetMapping("/test")
    public ResponseEntity<?> test() throws Exception {
        List<String> tokens = new ArrayList<>();
        tokens.add("e43wyKABSwiIvNV92LZWF_:APA91bEkyRwd98GLmqos9aV42_OAshwYO2h1Octz12GxbpkQ3qmAduwSQPqs_3lQEmxuwy4Dm3lBJp-uuNTH7zXep3ywGJUdyntFAT53SO-wj_X4LiRdrtc");

        this.pushTopicsService.subscribeUserTokens(1, tokens);

        Map<String, String> data = new HashMap<>();
        data.put("message", "funcionando");
        
        return ResponseEntity.ok(data);
    }
}
