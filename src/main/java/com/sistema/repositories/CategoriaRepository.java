package com.sistema.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sistema.domain.Categoria;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
}
