package com.sistema.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sistema.domain.Promocao;

public interface PromocaoRepository extends JpaRepository<Promocao, Long> {
}
