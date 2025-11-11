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
        return genreRepository.findByExhibitorId(exhibitorId);
    }

    public Genre addGenre(Genre genre) {
        return genreRepository.save(genre);
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
            String[] exhibitors = genre.getExhibitor_IDs();
            String[] updatedExhibitors;
            if (exhibitors == null) {
                updatedExhibitors = new String[] { exhibitorId };
            } else {
                updatedExhibitors = new String[exhibitors.length + 1];
                System.arraycopy(exhibitors, 0, updatedExhibitors, 0, exhibitors.length);
                updatedExhibitors[exhibitors.length] = exhibitorId;
            }
            genre.setExhibitor_IDs(updatedExhibitors);
            return genreRepository.save(genre);
        } else {
            throw new RuntimeException("Genre not found");
        }
    }
}