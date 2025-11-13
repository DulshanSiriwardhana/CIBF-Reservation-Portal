package com.cibf.stallservice.dto;

import com.cibf.stallservice.model.StallModel;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StallRequestDTO {
    @NotBlank(message = "Stall name is required")
    @Size(max = 10, message = "Stall name must not exceed 10 characters")
    private String stallName;

    @NotNull(message = "Size is required")
    private StallModel.StallSize size;

    @NotNull(message = "Dimension is required")
    @Positive(message = "Dimension must be positive")
    private Double dimension;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private Double price;

    @NotNull(message = "Position X is required")
    private Integer positionX;

    @NotNull(message = "Position Y is required")
    private Integer positionY;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;
}
