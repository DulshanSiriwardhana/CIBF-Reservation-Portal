package com.cibf.stallservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "stalls")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StallModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 10)
    private String stallName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StallSize size;

    @Column(nullable = false)
    private Double dimension;

    @Column(nullable = false)
    private Double price;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StallStatus status;

    @Column(nullable = false)
    private Integer positionX;

    @Column(nullable = false)
    private Integer positionY;

    @Column(length = 500)
    private String description;

    @Column(name = "reserved_by")
    private Long reservedBy;

    @Column(name = "reservation_id")
    private Long reservationId;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum StallSize {
        SMALL,
        MEDIUM,
        LARGE
    }

    public enum StallStatus {
        AVAILABLE,
        RESERVED,
        MAINTENANCE
    }

}
