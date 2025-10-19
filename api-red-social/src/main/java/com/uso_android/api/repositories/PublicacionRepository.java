package com.uso_android.api.repositories;

import com.uso_android.api.entities.Publicacion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PublicacionRepository extends JpaRepository<Publicacion, Integer> {
}