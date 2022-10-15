package com.sistema.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {
    
    @GetMapping("/")
    public String index() {
        return "/promo-add";
    }

    @GetMapping("/lista")
    public String login() {
        return "/promo-list";
    }
}
