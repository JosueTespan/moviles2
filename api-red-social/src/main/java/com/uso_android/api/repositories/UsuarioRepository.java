package com.uso_android.api.repositories;

import com.uso_android.api.dtos.usuario.UsuarioListDto;
import com.uso_android.api.entities.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    @Query("""
        SELECT new com.uso_android.api.dtos.usuario.UsuarioListDto(
            u.idUsuario, u.apellidoUsuario, u.correoUsuario,
            u.estadoUsuario, u.nombreUsuario, u.telefonoUsuario
        )
        FROM Usuario u
    """)
    Page<UsuarioListDto> pageableUsuarioListDto(Pageable pageable);

    @Query("""
        SELECT new com.uso_android.api.dtos.usuario.UsuarioListDto(
            u.idUsuario, u.apellidoUsuario, u.correoUsuario,
            u.estadoUsuario, u.nombreUsuario, u.telefonoUsuario
        )
        FROM Usuario u
        WHERE u.nombreUsuario LIKE CONCAT('%', :busqueda, '%') 
    """)
    Page<UsuarioListDto> pageableFilterUsuarioListDto(Pageable pageable, String busqueda);

    @Query("select (count(u) > 0) from Usuario u where u.idUsuario = :idUsuario")
    boolean existsByIdUsuario(Integer idUsuario);

    @Query("select (count(u) > 0) from Usuario u where u.correoUsuario = :correoUsuario")
    boolean existsByCorreoUsuario(String correoUsuario);

    Optional<Usuario> findByCorreoUsuario(String correoUsuario);
}