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
		SocialMetaTag tag = service
			.getSocialMetaTagByUrl(
				"https://www.nuuvem.com/br-pt/item/exit-the-gungeon"
			);
		System.out.println(tag.toString());

		/*SocialMetaTag twitter = service
			.getTwitterCardByUrl(
				"https://www.pichau.com.br/monitor-gamer-mancer-horizon-z21-21-45-pol-va-full-hd-1ms-75hz-freesync-g-sync-vga-hdmi-mcr-hzn21-bl1"
			);
		System.out.println(twitter.toString());*/
	}

}
