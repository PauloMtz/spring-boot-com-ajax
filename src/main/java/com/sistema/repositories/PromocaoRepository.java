package com.sistema.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.sistema.domain.Promocao;

public interface PromocaoRepository extends JpaRepository<Promocao, Long> {

	@Transactional(readOnly = false)
	@Modifying
	@Query("update Promocao p set p.likes = p.likes + 1 where p.id = :id")
	void updateSomarLikes(@Param("id") Long id);

	@Query("select p.likes from Promocao p where p.id = :id")
	int findLikeById(@Param("id") Long id);

	@Query("select distinct p.site from Promocao p "
		+ "where upper(p.site) like concat('%', upper(:site), '%')")
	List<String> findSiteByTermo(@Param("site") String site);

	@Query("select p from Promocao p where p.site like :site")
	Page<Promocao> findBySite(@Param("site") String site, Pageable pageable);

	@Query("select p from Promocao p where "
		+ "upper(p.titulo) like concat('%', upper(:search), '%') or "
		+ "upper(p.site) like concat('%', upper(:search), '%')")
	Page<Promocao> findByTituloOrSite(@Param("search") String search, Pageable pageable);
}
