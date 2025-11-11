package com.CIBF.genre_service.repository;

import com.CIBF.genre_service.model.Genre;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GenreRepository extends JpaRepository<Genre, Long> {
    List<Genre> findByExhibitorId(String exhibitorId);
}
