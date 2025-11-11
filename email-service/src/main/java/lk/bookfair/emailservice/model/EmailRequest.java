//package lk.bookfair.emailservice.model;
//
//import lombok.AllArgsConstructor;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//
//@Data
//@AllArgsConstructor
//@NoArgsConstructor
//public class EmailRequest {
//    private String to;
//    private String subject;
//    private String body;
//    private String qrCodeUrl; // optional
//}

package lk.bookfair.emailservice.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmailRequest {

    // Email basics
    private String to;
    private String subject;
    private String body;

    // Reservation info
    private String reservationId;
    private String status;
    private LocalDateTime reserveDate;
    private LocalDateTime reserveConfirmDate;
    private double amount;

    // Stall info
    private String stallId;
    private String stallName;
    private String stallSize;
    private String stallLocation;

    // User info
    private String businessName;
}

