package com.uso_android.api.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "usuarios")
public class Usuario implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "usuario_id", nullable = false)
    private Integer idUsuario;

    @Size(max = 200)
    @NotNull
    @Column(name = "usuario_nombre", nullable = false, length = 200)
    private String nombreUsuario;

    @Size(max = 200)
    @NotNull
    @Column(name = "usuario_apellido", nullable = false, length = 200)
    private String apellidoUsuario;

    @Size(max = 200)
    @NotNull
    @Column(name = "usuario_correo", nullable = false, length = 200)
    private String correoUsuario;

    @NotNull
    @Column(name = "usuario_estado", nullable = false)
    private boolean estadoUsuario;

    @CreationTimestamp
    @Column(name = "usuario_creacion", updatable = false)
    private Instant creacionUsuario;

    @UpdateTimestamp
    @Column(name = "usuario_modificacion")
    private Instant modificacionUsuario;

    @Size(max = 200)
    @NotNull
    @Column(name = "usuario_password", nullable = false, length = 200)
    private String passwordUsuario;

    @Size(max = 20)
    @Column(name = "usuario_telefono", length = 20)
    private String telefonoUsuario;

    @Size(max = 100)
    @Column(name = "usuario_token", length = 100)
    private String tokenUsuario;

    @Column(name = "usuario_imagen", length = 200)
    private String usuarioImagen;

    @Override
    public String getPassword() {
        return this.passwordUsuario;
    }

    @Override
    public String getUsername() {
        return this.correoUsuario;
    }

    @OneToMany(mappedBy = "usuario")
    private List<Amistad> usuarios;

    @OneToMany(mappedBy = "amigo")
    private List<Amistad> amigos;

    @OneToMany(mappedBy = "emisorUsuario")
    private List<SolicitudAmistad> solicitudesEnviadas;

    @OneToMany(mappedBy = "receptorUsuario")
    private List<SolicitudAmistad> solicitudesRecibidas;

    @OneToMany(mappedBy = "usuario")
    private List<Mensaje> listaMensajes;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        throw new UnsupportedOperationException("Unimplemented method 'getAuthorities'");
    }

}