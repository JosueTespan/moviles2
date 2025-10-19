package com.uso_android.api.services;

import com.uso_android.api.dtos.usuario.UsuarioListDto;
import com.uso_android.api.dtos.usuario.UsuarioRequestDto;
import com.uso_android.api.entities.Usuario;
import com.uso_android.api.exceptions.exception.DataDuplicationException;
import com.uso_android.api.exceptions.exception.NotFoundException;
import com.uso_android.api.mappers.UsuarioMapper;
import com.uso_android.api.repositories.UsuarioRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UsuarioService  {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioMapper usuarioMapper;

    public UsuarioService(UsuarioRepository usuarioRepository, UsuarioMapper usuarioMapper) {
        this.usuarioRepository = usuarioRepository;
        this.usuarioMapper = usuarioMapper;
    }

    @Transactional(readOnly = true)
    public Usuario getUsuarioEntity(Integer id){
        return this.usuarioRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado con el ID: " + id));
    }

    @Transactional(readOnly = true)
    public Usuario getUsuarioReference(Integer id){
        if(!this.usuarioRepository.existsById(id)){
            throw new NotFoundException("Usuario no encontrado con el ID: " + id);
        }
        return this.usuarioRepository.getReferenceById(id);
    }

    @Transactional(readOnly = true)
    public UsuarioRequestDto getUsuarioRequestDto(Integer id){
        Usuario usuario = this.getUsuarioEntity(id);
        UsuarioRequestDto usuarioRequestDto = this.usuarioMapper.toRequest(usuario);
        return usuarioRequestDto;
    }

    @Transactional
    public UsuarioListDto createUsuario(UsuarioRequestDto usuarioRequestDto){
        Usuario usuario = this.usuarioMapper.toEntity(usuarioRequestDto);
        usuario.setPasswordUsuario(usuarioRequestDto.getPasswordUsuario());
        this.usuarioRepository.save(usuario);
        return this.usuarioMapper.toList(usuario);
    }

    @Transactional
    public UsuarioListDto updateUsuario(Integer idUsuario, UsuarioRequestDto usuarioRequestDto){
        Usuario usuario = this.getUsuarioEntity(idUsuario);
        if(!usuario.getCorreoUsuario().equals(usuarioRequestDto.getCorreoUsuario()) && usuarioRepository.existsByCorreoUsuario(usuarioRequestDto.getCorreoUsuario())){
            throw new DataDuplicationException("El correo ya esta en uso");
        }
        this.usuarioMapper.partialUpdate(usuarioRequestDto, usuario);
        if(usuarioRequestDto.getPasswordUsuario() != null && usuarioRequestDto.getPasswordUsuario().isBlank() == false){
            usuario.setPasswordUsuario(usuarioRequestDto.getPasswordUsuario());
        }
        return this.usuarioMapper.toList(usuario);
    }

    @Transactional(readOnly = true)
    public Page<UsuarioListDto> getPageableUsuarioListDto(Pageable pageable){
        return this.usuarioRepository.pageableUsuarioListDto(pageable);
    }

    @Transactional(readOnly = true)
    public Page<UsuarioListDto> getPageableFilterUsuarioListDto(Pageable pageable, String busqueda){
        return this.usuarioRepository.pageableFilterUsuarioListDto(pageable,busqueda);
    }

}
