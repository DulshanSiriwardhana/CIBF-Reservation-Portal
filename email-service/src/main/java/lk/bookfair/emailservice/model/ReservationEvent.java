package lk.bookfair.emailservice.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationEvent {
    private String event;
    private String reservationId;
    private String userId;
    private String email;
    private String status;
    private double amount;
    private String stallId;
    private String reserveDate;
    private String reserveConfirmDate;
}