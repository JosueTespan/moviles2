package com.uso_android.api.repositories;

import com.uso_android.api.dtos.ChatDto;
import com.uso_android.api.entities.Chat;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ChatRepository extends JpaRepository<Chat, Integer> {

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

  @Query("""
          select new com.uso_android.api.dtos.ChatDto(
            c.usuario1.idUsuario, c.usuario1.nombreUsuario, c.usuario1.usuarioImagen,
            c.usuario1.apellidoUsuario, c.usuario2.nombreUsuario, c.usuario2.usuarioImagen,
            c.usuario2.apellidoUsuario
          ) from Chat c where c.chatId = :chat
      """)
  ChatDto getInfoChat(Integer chat);

  @Modifying(clearAutomatically = true, flushAutomatically = true)
  @Query("update Chat c set c.mensaje.mensajeId = :mensajeId where c.chatId = :chatId")
  void setUltimoMensaje(Integer chatId, Integer mensajeId);
}
