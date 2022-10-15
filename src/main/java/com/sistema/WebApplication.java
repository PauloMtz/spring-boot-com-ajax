package com.sistema;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.sistema.domain.SocialMetaTag;
import com.sistema.services.SocialMetaTagService;

@SpringBootApplication
public class WebApplication implements CommandLineRunner {

	public static void main(String[] args) {
		SpringApplication.run(WebApplication.class, args);
	}

	@Autowired
	private SocialMetaTagService service;

	@Override
	public void run(String... args) throws Exception {
		SocialMetaTag og = service.getOpenGraphByUrl("https://www.pichau.com.br/headset-razer-kraken-x-lite-audio-7-1-preto-rz04-02950100-r381-razer");
		System.out.println(og.toString());
	}

}
