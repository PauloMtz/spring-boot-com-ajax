package com.sistema.services;

import java.util.LinkedHashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;

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

            Pageable pageable = PageRequest.of(current, length, direction, column);

            Map<String, Object> json = new LinkedHashMap<>();
            json.put("draw", draw);
            json.put("recordsTotal", 0);
            json.put("recordsFiltered", 0);
            json.put("data", null);

            return json;
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
