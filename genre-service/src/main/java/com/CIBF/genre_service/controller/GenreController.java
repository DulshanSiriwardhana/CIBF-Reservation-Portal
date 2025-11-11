package com.CIBF.genre_service.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.CIBF.genre_service.model.Genre;
import com.CIBF.genre_service.service.GenreService;

@RestController
@RequestMapping("/api/genres")
public class GenreController {

    private final GenreService genreService;

    @Autowired
    public GenreController(GenreService genreService) {
        this.genreService = genreService;
    }

    @GetMapping("/{exhibitorId}")
    public ResponseEntity<List<Genre>> getGenresByExhibitorId(@PathVariable String exhibitorId) {
        List<Genre> genres = genreService.getGenresByExhibitorId(exhibitorId);
        return ResponseEntity.ok(genres);
    }

    @PostMapping
    public ResponseEntity<Genre> addGenre(@RequestBody Genre genre) {
        Genre createdGenre = genreService.addGenre(genre);
        return ResponseEntity.status(201).body(createdGenre);
    }

    @PostMapping("/{exhibitorId}/{genreId}")
    public ResponseEntity<Genre> addExhibitorToGenre(@PathVariable String exhibitorId, @PathVariable Long genreId) {
        Genre updatedGenre = genreService.addExhibitorToGenre(exhibitorId, genreId);
        return ResponseEntity.ok(updatedGenre);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Genre> updateGenre(@PathVariable Long id, @RequestBody Genre genre) {
        return genreService.updateGenre(id, genre)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGenre(@PathVariable Long id) {
        genreService.deleteGenre(id);
        return ResponseEntity.noContent().build();
    }
}