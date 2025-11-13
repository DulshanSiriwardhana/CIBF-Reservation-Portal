package lk.bookfair.emailservice.listener;

import com.fasterxml.jackson.databind.ObjectMapper;
import lk.bookfair.emailservice.config.RabbitMQConfig;
import lk.bookfair.emailservice.model.EmailRequest;
import lk.bookfair.emailservice.model.ReservationEvent;
import lk.bookfair.emailservice.service.EmailSenderService;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Component
@RequiredArgsConstructor
public class ReservationEventListener {

    private final EmailSenderService emailSenderService;
    private final ObjectMapper objectMapper;

    @RabbitListener(queues = RabbitMQConfig.QUEUE_EMAIL)
    public void handleReservationEvent(String message) {
        try {
            System.out.println(" Received message from RabbitMQ: " + message);
            
            ReservationEvent event = objectMapper.readValue(message, ReservationEvent.class);
            
            System.out.println("   Processing event: " + event.getEvent());
            System.out.println("   Reservation ID: " + event.getReservationId());
            System.out.println("   Email: " + event.getEmail());
            System.out.println("   Status: " + event.getStatus());

            EmailRequest emailRequest = buildEmailRequest(event);
            emailSenderService.sendEmailWithQR(emailRequest);
            
            System.out.println("Email sent successfully for reservation: " + event.getReservationId());
            
        } catch (Exception e) {
            System.err.println("Error processing reservation event: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private EmailRequest buildEmailRequest(ReservationEvent event) {
        EmailRequest.EmailRequestBuilder builder = EmailRequest.builder()
                .to(event.getEmail())
                .reservationId(event.getReservationId())
                .status(event.getStatus())
                .amount(event.getAmount())
                .stallId(event.getStallId())
                .businessName("Customer")
                .stallName("Stall " + event.getStallId())
                .stallSize("Standard")
                .stallLocation("Main Hall");

        // Parse dates
        if (event.getReserveDate() != null) {
            builder.reserveDate(parseDateTime(event.getReserveDate()));
        }
        if (event.getReserveConfirmDate() != null) {
            builder.reserveConfirmDate(parseDateTime(event.getReserveConfirmDate()));
        }

        // Set subject and body based on event type
        switch (event.getEvent()) {
            case "RESERVATION_CREATED":
                builder.subject("Reservation Created - Colombo International Book Fair")
                       .body("Your reservation has been created and is pending confirmation.");
                break;
            case "RESERVATION_CONFIRMED":
                builder.subject("Reservation Confirmed - Colombo International Book Fair")
                       .body("Your reservation has been confirmed! Please find your QR pass attached.");
                break;
            case "RESERVATION_CANCELLED":
                builder.subject("Reservation Cancelled - Colombo International Book Fair")
                       .body("Your reservation has been cancelled. If this was a mistake, please contact support.");
                break;
            default:
                builder.subject("Reservation Update - Colombo International Book Fair")
                       .body("Your reservation status has been updated.");
        }

        return builder.build();
    }

    private LocalDateTime parseDateTime(String dateTimeStr) {
        try {
            return LocalDateTime.parse(dateTimeStr);
        } catch (Exception e) {
            System.err.println("Failed to parse date: " + dateTimeStr);
            return LocalDateTime.now();
        }
    }
}