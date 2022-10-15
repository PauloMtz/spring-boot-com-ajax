package com.sistema.services;

import java.io.IOException;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.sistema.domain.SocialMetaTag;

@Service
public class SocialMetaTagService {

    private static Logger log = LoggerFactory.getLogger(SocialMetaTagService.class);

    public SocialMetaTag getSocialMetaTagByUrl(String url) {

        SocialMetaTag twitter = getTwitterCardByUrl(url);

        if (!estaVazio(twitter)) {
            return twitter;
        }

        SocialMetaTag openGraph = getOpenGraphByUrl(url);

        if (!estaVazio(openGraph)) {
            return openGraph;
        }

        return null;
    }

    private SocialMetaTag getTwitterCardByUrl(String url) {

        SocialMetaTag tag = new SocialMetaTag();

        try {
            Document doc = Jsoup.connect(url).get();
            tag.setTitle(doc.head().select("meta[name=twitter:title]").attr("content"));
            tag.setSite(doc.head().select("meta[name=twitter:site_name]").attr("content"));
            tag.setImage(doc.head().select("meta[name=twitter:image]").attr("content"));
            tag.setUrl(doc.head().select("meta[name=twitter:url]").attr("content"));
        } catch (IOException e) {
            log.error(e.getMessage(), e.getCause());
        }

        return tag;
    }
    
    private SocialMetaTag getOpenGraphByUrl(String url) {

        SocialMetaTag tag = new SocialMetaTag();

        try {
            Document doc = Jsoup.connect(url).get();
            tag.setTitle(doc.head().select("meta[property=og:title]").attr("content"));
            tag.setSite(doc.head().select("meta[property=og:site_name]").attr("content"));
            tag.setImage(doc.head().select("meta[property=og:image]").attr("content"));
            tag.setUrl(doc.head().select("meta[property=og:url]").attr("content"));
        } catch (IOException e) {
            log.error(e.getMessage(), e.getCause());
        }

        return tag;
    }

    private boolean estaVazio(SocialMetaTag tag) {
        if (tag.getImage().isEmpty()) return true;
        if (tag.getSite().isEmpty()) return true;
        if (tag.getTitle().isEmpty()) return true;
        if (tag.getUrl().isEmpty()) return true;

        return false;
    }
}
