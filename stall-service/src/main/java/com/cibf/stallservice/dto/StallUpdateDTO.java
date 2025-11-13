package com.cibf.stallservice.dto;

import com.cibf.stallservice.model.StallModel;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StallUpdateDTO {
    @Size(max = 10, message = "Stall name must not exceed 10 characters")
    private String stallName;

    private StallModel.StallSize size;

    @Positive(message = "Dimension must be positive")
    private Double dimension;

    @Positive(message = "Price must be positive")
    private Double price;

    private StallModel.StallStatus status;

    private Integer positionX;

    private Integer positionY;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;
}
