package com.uso_android.api.mappers;

import com.uso_android.api.dtos.usuario.UsuarioListDto;
import com.uso_android.api.dtos.usuario.UsuarioRequestDto;
import com.uso_android.api.entities.Usuario;
import org.mapstruct.*;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = MappingConstants.ComponentModel.SPRING)
public interface UsuarioMapper {

    @Mapping(target = "passwordUsuario", ignore = true)
    Usuario toEntity(UsuarioRequestDto usuarioRequestDto);

    UsuarioRequestDto toRequest(Usuario usuario);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    Usuario partialUpdate(UsuarioRequestDto usuarioRequestDto, @MappingTarget Usuario usuario);

    UsuarioListDto toList(Usuario usuario);
}