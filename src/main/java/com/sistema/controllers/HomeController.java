package com.sistema.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {
    
    @GetMapping("/")
    public String index() {
        return "redirect:/promocao/add";
    }

    @GetMapping("/sites")
    public String sites() {
        return "/links-sites-validos";
    }
}
