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
public class StallReleasedEvent implements Serializable {
    private Long stallId;
    private String stallName;
    private Long userId;
    private LocalDateTime releasedAt;

}