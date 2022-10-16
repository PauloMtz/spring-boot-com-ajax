package com.sistema.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;

import com.sistema.domain.Categoria;
import com.sistema.repositories.CategoriaRepository;

@Controller
@RequestMapping("/promocao")
public class PromocaoController {

    @Autowired
    private CategoriaRepository categoriaRepository;

    @ModelAttribute("categoriasSelect")
    public List<Categoria> getCategorias() {
        return categoriaRepository.findAll();
    }
    
    @GetMapping("/add")
    public String abrirCadastro() {
        return "promo-add";
    }
}
