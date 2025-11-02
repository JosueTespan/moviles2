package com.uso_android.api.services;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.uso_android.api.dtos.ChatDto;
import com.uso_android.api.dtos.MensajeDto;
import com.uso_android.api.entities.Chat;
import com.uso_android.api.entities.ImagenMensaje;
import com.uso_android.api.entities.Mensaje;
import com.uso_android.api.exceptions.exception.NotFoundException;
import com.uso_android.api.repositories.ChatRepository;
import com.uso_android.api.repositories.ImagenMensajeRepository;
import com.uso_android.api.repositories.MensajeRepository;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class ChatService {
    private final ChatRepository chatRepository;
    private final MensajeRepository mensajeRepository;
    private final ImagenMensajeRepository imagenMensajeRepository;
    private final UsuarioService usuarioService;
    private final GcsService gcsService;

    @Transactional(readOnly = true)
    public Chat obtenerReferenciaChat(int id) {
        if (!this.chatRepository.existsById(id)) {
            throw new NotFoundException("Chat no encontrado con el ID: " + id);
        }
        return this.chatRepository.getReferenceById(id);
    }

    @Transactional(readOnly = true)
    public Mensaje obtenerReferenciaMensaje(int id) {
        if (!this.mensajeRepository.existsById(id)) {
            throw new NotFoundException("Mensaje no encontrado con el ID: " + id);
        }
        return this.mensajeRepository.getReferenceById(id);
    }

    public List<ChatDto> getChatsUsuario(Integer user, Integer page) {
        return this.chatRepository.getChatsUsuario(user, page);
    }

    public List<MensajeDto> getChatMessages(Integer chat, Integer page) {
        List<MensajeDto> mensajes = this.mensajeRepository.getMessagesByChat(chat, page);

        for (MensajeDto mensajeDto : mensajes) {
            if (mensajeDto.isHasImages()) {
                List<String> rutasTemporales = imagenMensajeRepository.getImagesByMessage(mensajeDto.getMensajeId());

                for (int i = 0; i < rutasTemporales.size(); i++) {
                    String urlTemporal = gcsService.generarUrlTemporal(rutasTemporales.get(i));
                    rutasTemporales.set(i, urlTemporal);
                }

                mensajeDto.setImagenes(rutasTemporales);
            }
        }

        return mensajes;
    }

    public ChatDto getInfoChat(Integer chat) {
        return this.chatRepository.getInfoChat(chat);
    }

    @Transactional
    public Mensaje nuevoMensaje(MensajeDto mensajeDto) {
        Mensaje mensaje = new Mensaje();
        mensaje.setChat(this.obtenerReferenciaChat(mensajeDto.getChatId()));
        mensaje.setUsuario(this.usuarioService.getUsuarioReference(mensajeDto.getUsuarioId()));
        mensaje.setMensajeEnvio(LocalDateTime.now());
        mensaje.setMensajeTexto(mensajeDto.getMensajeTexto());

        if (mensajeDto.getMensajePadreId() != null) {
            mensaje.setMensajePadre(this.obtenerReferenciaMensaje(mensajeDto.getMensajePadreId()));
        }

        mensaje = this.mensajeRepository.save(mensaje);
        List<String> archivos = new ArrayList<>();

        if (mensajeDto.getFiles() != null && mensajeDto.getFiles().size() > 0) {
            mensaje.setHasImages(true);

            for (MultipartFile file : mensajeDto.getFiles()) {
                try {
                    ImagenMensaje imagen = new ImagenMensaje();

                    imagen.setMensaje(mensaje);
                    imagen.setImagenMensajeRuta(gcsService.upload(file, "chats" + mensajeDto.getChatId()));
                    archivos.add(gcsService.generarUrlTemporal(imagen.getImagenMensajeRuta()));

                    this.imagenMensajeRepository.save(imagen);
                } catch (Exception e) {
                }
            }
        }

        mensajeDto.setImagenes(archivos);
        mensaje.getChat().setMensaje(mensaje);
        this.chatRepository.save(mensaje.getChat());
        
        return mensaje;
    }
}
