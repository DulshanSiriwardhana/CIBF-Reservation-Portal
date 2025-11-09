package com.example.notificationservice.consumer;

import com.example.notificationservice.config.RabbitMQConfig;
import com.example.notificationservice.service.EmailService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class EmailConsumer {

    private final EmailService emailService;
    private final ObjectMapper objectMapper;

    @RabbitListener(queues = RabbitMQConfig.RESERVATION_EMAIL_QUEUE)
    public void consumeMessage(String messageJson) {
        try {
            Map<String, Object> messageMap = objectMapper.readValue(messageJson, Map.class);

            System.out.println("📨 Received message: " + messageJson);

            String email = (String) messageMap.get("email");
            String status = (String) messageMap.get("status");
            String reservationId = (String) messageMap.get("reservationId");
            String qrId = (String) messageMap.get("qrId");
            String event = (String) messageMap.get("event");

            // Build email subject and body based on event type
            String subject = buildSubject(event, status);
            String text = buildEmailBody(messageMap, event, status, reservationId);

            // Send email with QR code path if available
            emailService.sendEmail(email, subject, text, null, qrId);
            
            System.out.println("Email sent successfully to: " + email);
        } catch (MessagingException e) {
            System.err.println("Failed to send email: " + e.getMessage());
            e.printStackTrace();
        } catch (Exception e) {
            System.err.println("Error processing message: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private String buildSubject(String event, String status) {
        switch (event) {
            case "RESERVATION_CREATED":
                return "Reservation Created Successfully";
            case "RESERVATION_CONFIRMED":
                return "Reservation Confirmed";
            case "RESERVATION_CANCELLED":
                return "Reservation Cancelled";
            default:
                return "Reservation " + status;
        }
    }

    private String buildEmailBody(Map<String, Object> messageMap, String event, String status, String reservationId) {
        StringBuilder body = new StringBuilder();
        body.append("<html><body style='font-family: Arial, sans-serif;'>");
        body.append("<h2 style='color: #333;'>Reservation Update</h2>");
        body.append("<p>Dear Customer,</p>");

        switch (event) {
            case "RESERVATION_CREATED":
                body.append("<p>Your reservation has been <strong>created successfully</strong>.</p>");
                body.append("<p><strong>Reservation ID:</strong> ").append(reservationId).append("</p>");
                body.append("<p><strong>Status:</strong> ").append(status).append("</p>");
                
                Object amount = messageMap.get("amount");
                if (amount != null) {
                    body.append("<p><strong>Amount:</strong> $").append(amount).append("</p>");
                }
                
                Object stallId = messageMap.get("stallId");
                if (stallId != null) {
                    body.append("<p><strong>Stall ID:</strong> ").append(stallId).append("</p>");
                }
                
                body.append("<p>Please keep your QR code attached to this email for check-in.</p>");
                break;

            case "RESERVATION_CONFIRMED":
                body.append("<p>Your reservation has been <strong>confirmed</strong>!</p>");
                body.append("<p><strong>Reservation ID:</strong> ").append(reservationId).append("</p>");
                
                Object confirmDate = messageMap.get("reserveConfirmDate");
                if (confirmDate != null) {
                    body.append("<p><strong>Confirmed on:</strong> ").append(confirmDate).append("</p>");
                }
                
                body.append("<p>Your updated QR code is attached. Please present it at the venue.</p>");
                break;

            case "RESERVATION_CANCELLED":
                body.append("<p>Your reservation has been <strong>cancelled</strong>.</p>");
                body.append("<p><strong>Reservation ID:</strong> ").append(reservationId).append("</p>");
                body.append("<p>If you did not request this cancellation, please contact support immediately.</p>");
                break;

            default:
                body.append("<p>Your reservation with ID <strong>").append(reservationId)
                    .append("</strong> is now <strong>").append(status).append("</strong>.</p>");
        }

        body.append("<br>");
        body.append("<p>Thank you for choosing our service!</p>");
        body.append("<p style='color: #666; font-size: 12px;'>This is an automated message. Please do not reply.</p>");
        body.append("</body></html>");

        return body.toString();
    }
}