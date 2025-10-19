package com.uso_android.api.repositories;

import com.uso_android.api.dtos.ChatDto;
import com.uso_android.api.entities.Chat;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ChatRepository extends JpaRepository<Chat, Integer>{
  
    @Query(value = """
      SELECT 
        CAST(sq.chat_id AS UNSIGNED) AS chatId,
        CAST(sq.usuarioId AS UNSIGNED) AS usuarioId,
        CONCAT(u.usuario_nombre, ' ', u.usuario_apellido) AS nombreUsuario,
        u.usuario_imagen AS imagenUsuario,
        m.mensaje_texto AS ultimoMensaje,
        m.mensaje_envio AS fechaUltimoMensaje
      FROM (
          (SELECT c.usuario2_id AS usuarioId, c.chat_id, c.mensaje_id, chat_ultima_actividad
             FROM chats c WHERE c.usuario1_id = :usuario)
           UNION
          (SELECT c.usuario1_id AS usuarioId, c.chat_id, c.mensaje_id, chat_ultima_actividad
             FROM chats c WHERE c.usuario2_id = :usuario)
      ) sq
      JOIN mensajes m ON m.mensaje_id = sq.mensaje_id
      JOIN usuarios u ON u.usuario_id = sq.usuarioId
      ORDER BY chat_ultima_actividad DESC
      LIMIT :limite, 10
      """, nativeQuery = true)
    List<ChatDto> getChatsUsuario(Integer usuario, Integer limite);
}
