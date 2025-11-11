package com.CIBF.genre_service.model;

import java.beans.BeanProperty;
import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "genres")
public class Genre {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    private String description;

    @Column(name = "exhibitor_IDs", columnDefinition = "TEXT[]")
    private String[] exhibitor_IDs;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void updateDate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String[] getExhibitor_IDs() {
        return exhibitor_IDs;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setExhibitor_IDs(String[] exhibitor_IDs) {
        this.exhibitor_IDs = exhibitor_IDs;
    }

}