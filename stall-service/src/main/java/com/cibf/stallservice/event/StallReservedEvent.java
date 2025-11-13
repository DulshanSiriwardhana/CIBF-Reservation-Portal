package com.cibf.stallservice.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StallReservedEvent implements Serializable {
    private Long stallId;
    private String stallName;
    private Long userId;
    private Long reservationId;
    private Double price;
    private LocalDateTime reservedAt;
}