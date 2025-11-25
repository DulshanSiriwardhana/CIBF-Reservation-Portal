package com.CIBF.genre_service.repository;

import com.CIBF.genre_service.model.Genre;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface GenreRepository extends JpaRepository<Genre, Long> {
    List<Genre> findByExhibitorIDsContaining(String exhibitorId);

    @Query("""
    SELECT g.name
    FROM Genre g JOIN g.exhibitorIDs e
    WHERE e = :exhibitorId
    """)
    List<String> findGenreNamesByExhibitorId(@Param("exhibitorId") String exhibitorId);

    @Query("SELECT g.name FROM Genre g")
    List<String> findAllNames();
}
