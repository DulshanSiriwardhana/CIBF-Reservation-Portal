package com.cibf.stallservice.dto;

import com.cibf.stallservice.model.StallModel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StallResponseDTO {
    private Long id;
    private String stallName;
    private StallModel.StallSize size;
    private Double dimension;
    private Double price;
    private StallModel.StallStatus status;
    private Integer positionX;
    private Integer positionY;
    private String description;
    private Long reservedBy;
    private Long reservationId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
