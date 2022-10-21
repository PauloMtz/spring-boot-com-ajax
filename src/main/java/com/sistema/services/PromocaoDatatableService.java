package com.sistema.services;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;

import com.sistema.domain.Promocao;
import com.sistema.repositories.PromocaoRepository;

public class PromocaoDatatableService {
    
    private String[] colunas = {
        "id", "titulo", "site", "linkPromocao", "descricao",
        "linkImagem", "preco", "likes", "dataCadastro", "categoria"
    };

    public Map<String, Object> execute(PromocaoRepository repository,
        HttpServletRequest request) {

        int start = Integer.parseInt(request.getParameter("start"));
        int length = Integer.parseInt(request.getParameter("length"));
        int draw = Integer.parseInt(request.getParameter("draw"));

        int current = currentPage(start, length);
        String column = columnName(request);
        Sort.Direction direction = ordernarPor(request);
        String pesquisar = pesquisarPor(request);

        Pageable pageable = PageRequest.of(current, length, direction, column);
        Page<Promocao> page = queryBy(pesquisar, repository, pageable);

        Map<String, Object> json = new LinkedHashMap<>();
        json.put("draw", draw);
        json.put("recordsTotal", page.getTotalElements());
        json.put("recordsFiltered", page.getTotalElements());
        json.put("data", page.getContent());

        return json;
    }

    private Page<Promocao> queryBy(String search, PromocaoRepository repository, Pageable pageable) {
        if (search.isEmpty()) {
            return repository.findAll(pageable);
        }

        // ver site https://regex101.com
        // valores de 0 a 9 com ponto ou vírgula com 0 a 9 depois da vírgula e 2 casas
        if (search.matches("^[0-9]+([.,][0-9]{2})?$")) {
            search = search.replace(",", "."); // se digitar ponto, troca por vírgula
            return repository.findByPreco(new BigDecimal(search), pageable);
        }

        return repository.findByTituloOrSite(search, pageable);
    }

    private String pesquisarPor(HttpServletRequest request) {
        return request.getParameter("search[value]").isEmpty()
                ? "" 
                : request.getParameter("search[value]");
    }

    private Direction ordernarPor(HttpServletRequest request) {

        String order = request.getParameter("order[0][dir]");
        Sort.Direction sort = Sort.Direction.ASC;

        // inverte a ordenação
        if (order.equalsIgnoreCase("desc")) {
            sort = Sort.Direction.DESC;
        }

        return sort;
    }

    private String columnName(HttpServletRequest request) {
        int iCol = Integer.parseInt(request.getParameter("order[0][column]"));
        return colunas[iCol];
    }

    private int currentPage(int start, int length) {
        //  0     1      2 --> páginas [começa no indice 0]
        // 0-9  10-19  20-29 --> indices dos registros por página
        // primeira página --> (0 / 10) = 0 => primeira página, o primeiro registro é zero
        // segunda página --> (10 / 10) = 1 => o primeiro registro é o décimo
        // terceira página -> (20 / 10) = 2 => o primeiro registro é o vigésimo
        return start / length;
    }
}
