package com.sistema.controllers;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.sistema.domain.Categoria;
import com.sistema.domain.Promocao;
import com.sistema.repositories.CategoriaRepository;
import com.sistema.repositories.PromocaoRepository;
import com.sistema.services.PromocaoDatatableService;

@Controller
@RequestMapping("/promocao")
public class PromocaoController {

    private static Logger log = LoggerFactory.getLogger(PromocaoController.class);

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private PromocaoRepository promocaoRepository;

    @GetMapping("/tabela")
    public String carregaTabela() {
        return "promo-datatables"; // template
    }

    @GetMapping("/datatable/server")
    public ResponseEntity<?> carregaDatatable(HttpServletRequest request) {
        Map<String, Object> data = new PromocaoDatatableService().execute(promocaoRepository, request);
        return ResponseEntity.ok(data);
    }

    @GetMapping("/excluir/{id}")
    public ResponseEntity<?> excluirPromocao(@PathVariable("id") Long id) {
        promocaoRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/site")
    public ResponseEntity<?> autocompleteByTermo(@RequestParam("termo") String termo) {
        List<String> sites = promocaoRepository.findSiteByTermo(termo);
        return ResponseEntity.ok(sites);
    }

    @GetMapping("/site/list")
    public String listarPorSite(@RequestParam("site") String site, ModelMap model) {
        Sort sort = Sort.by("dataCadastro").descending();
        Pageable paginacao = PageRequest.of(0, 4, sort);
        model.addAttribute("promocoes", promocaoRepository.findBySite(site, paginacao));
        return "fragments/promo-card";
    }

    @PostMapping("/like/{id}")
    public ResponseEntity<?> addLike(@PathVariable("id") Long id) {
        promocaoRepository.updateSomarLikes(id);
        int likes = promocaoRepository.findLikeById(id);
        return ResponseEntity.ok(likes);
    }

    @GetMapping("/list")
    public String listaOfertas(ModelMap model) {
        Sort sort = Sort.by("dataCadastro").descending();
        Pageable paginacao = PageRequest.of(0, 4, sort);
        model.addAttribute("promocoes", promocaoRepository.findAll(paginacao));
        return "promo-list";
    }

    @GetMapping("/list/scroll")
    public String listaCards(@RequestParam(name = "page", defaultValue = "1") int page, 
        @RequestParam(name = "site", defaultValue = "") String site, ModelMap model) {
        
        Sort sort = Sort.by("dataCadastro").descending();
        Pageable paginacao = PageRequest.of(page, 4, sort);

        if (site.isEmpty()) {
            model.addAttribute("promocoes", promocaoRepository.findAll(paginacao));
        } else {
            model.addAttribute("promocoes", promocaoRepository.findBySite(site, paginacao));
        }

        return "fragments/promo-card";
    }

    @PostMapping("/save")
    public ResponseEntity<?> salvarPromocao(@Valid Promocao promocao,
        BindingResult result) {
        
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();

            for (FieldError error : result.getFieldErrors()) {
                errors.put(error.getField(), error.getDefaultMessage());
            }

            return ResponseEntity.unprocessableEntity().body(errors);
        }

        log.info("Promoção {}", promocao.toString());
        promocao.setDataCadastro(LocalDateTime.now());
        promocaoRepository.save(promocao);

        return ResponseEntity.ok().build();
    }

    @ModelAttribute("categoriasSelect")
    public List<Categoria> getCategorias() {
        return categoriaRepository.findAll();
    }
    
    @GetMapping("/add")
    public String abrirCadastro() {
        return "promo-add";
    }
}
