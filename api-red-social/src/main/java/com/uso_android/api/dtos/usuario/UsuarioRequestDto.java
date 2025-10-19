package com.uso_android.api.dtos.usuario;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UsuarioRequestDto {

    @NotNull
    @Size(max = 200)
    private String apellidoUsuario;

    @NotNull
    @Size(max = 200)
    private String correoUsuario;

    @Size(max = 10)
    private String duiUsuario;

    private boolean estadoUsuario;

    @NotNull
    @Size(max = 200)
    private String nombreUsuario;

    @NotNull
    @Size(max = 200)
    private String passwordUsuario;

    @Size(max = 20)

    private String telefonoUsuario;

    private List<Integer> idRoles;

}