package com.uso_android.api.dtos.usuario;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UsuarioListDto{

    private Integer idUsuario;

    @NotNull
    @Size(max = 200)
    private String apellidoUsuario;

    @NotNull
    @Size(max = 200)
    private String correoUsuario;

    private boolean estadoUsuario;

    @NotNull
    @Size(max = 200)
    private String nombreUsuario;

    @Size(max = 20)
    private String telefonoUsuario;

}