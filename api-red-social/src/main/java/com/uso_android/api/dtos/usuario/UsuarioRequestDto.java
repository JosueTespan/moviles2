package com.uso_android.api.dtos.usuario;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UsuarioRequestDto {

    @NotNull
    @Size(max = 200)
    @JsonInclude(Include.NON_NULL)
    private String apellidoUsuario;

    @NotNull
    @Size(max = 200)
    @JsonInclude(Include.NON_NULL)
    private String correoUsuario;

    @JsonInclude(Include.NON_NULL)
    private boolean estadoUsuario;

    @NotNull
    @Size(max = 200)
    @JsonInclude(Include.NON_NULL)
    private String nombreUsuario;

    @NotNull
    @Size(max = 200)
    @JsonInclude(Include.NON_NULL)
    private String passwordUsuario;

    @Size(max = 20)
    @JsonInclude(Include.NON_NULL)
    private String telefonoUsuario;
    
    @JsonInclude(Include.NON_NULL)
    private String usuarioImagen;

    @JsonInclude(Include.NON_NULL)
    private List<Integer> idRoles;

}