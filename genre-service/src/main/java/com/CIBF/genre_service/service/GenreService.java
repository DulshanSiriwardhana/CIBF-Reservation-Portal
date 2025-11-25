package com.CIBF.genre_service.service;

import java.util.List;
import java.util.Optional;
import com.CIBF.genre_service.model.Genre;
import com.CIBF.genre_service.repository.GenreRepository;
import org.springframework.stereotype.Service;

@Service
public class GenreService {
    private final GenreRepository genreRepository;

    public GenreService(GenreRepository genreRepository) {
        this.genreRepository = genreRepository;
    }

    public List<Genre> getGenresByExhibitorId(String exhibitorId) {
        return genreRepository.findByExhibitorIDsContaining(exhibitorId);
    }

    public List<String> getGenreNamesByExhibitorId(String exhibitorId) {
        return genreRepository.findGenreNamesByExhibitorId(exhibitorId);
    }

    public Genre addGenre(Genre genre) {
        return genreRepository.save(genre);
    }

    public List<Genre> getAllGenres() {
        return genreRepository.findAll();
    }

    public List<String> getAllGenreNames() {
        return genreRepository.findAllNames();
    }

    public Optional<Genre> updateGenre(Long id, Genre updatedGenre) {
        return genreRepository.findById(id).map(existing -> {
            existing.setName(updatedGenre.getName());
            existing.setDescription(updatedGenre.getDescription());
            return genreRepository.save(existing);
        });
    }

    public void deleteGenre(Long id) {
        genreRepository.deleteById(id);
    }

    public Genre addExhibitorToGenre(String exhibitorId, Long genreId) {
        Optional<Genre> genreOpt = genreRepository.findById(genreId);
        if (genreOpt.isPresent()) {
            Genre genre = genreOpt.get();
            genre.addExhibitorID(exhibitorId);
            return genreRepository.save(genre);
        } else {
            throw new RuntimeException("Genre not found");
        }
    }

    public List<Genre> addExhibitorToMultipleGenres(String exhibitorId, List<String> genreNames) {

        List<Genre> genres = genreRepository.findByNameIn(genreNames);

        for (Genre genre : genres) {
            if (!genre.getExhibitorIDs().contains(exhibitorId)) {
                genre.getExhibitorIDs().add(exhibitorId);
            }
        }

        return genreRepository.saveAll(genres);
    }

}