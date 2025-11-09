package com.example.reservation.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "reservations")
public class Reservation {
    @Id
    private String reservationId;
    private LocalDateTime reserveDate;
    private String status;
    private String userId;
    private String email;
    private double amount;
    private String stallId;
    private LocalDateTime reserveConfirmDate;
}