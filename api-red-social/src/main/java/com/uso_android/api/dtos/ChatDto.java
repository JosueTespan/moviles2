package com.uso_android.api.dtos;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ChatDto {
    private Long chatId;
    private Long usuarioId;
    private String nombreUsuario;
    private String imagenUsuario;
    private String ultimoMensaje;
    private java.sql.Timestamp fechaUltimoMensaje;
}
