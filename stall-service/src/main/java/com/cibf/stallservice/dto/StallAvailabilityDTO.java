package com.cibf.stallservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StallAvailabilityDTO {
    private Long stallId;
    private String stallName;
    private boolean isAvailable;
    private String message;
}
