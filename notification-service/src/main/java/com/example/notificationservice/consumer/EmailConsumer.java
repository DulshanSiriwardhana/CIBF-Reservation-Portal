package com.example.notificationservice.consumer;

import com.example.notificationservice.config.RabbitMQConfig;
import com.example.notificationservice.service.EmailService;
import com.example.notificationservice.util.QRCodeGenerator;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class EmailConsumer {

    private final EmailService emailService;
    private final ObjectMapper objectMapper;

    @Value("${qrcode.folder:qrcodes}")
    private String qrFolder;

    @RabbitListener(queues = RabbitMQConfig.RESERVATION_EMAIL_QUEUE)
    public void consumeMessage(String messageJson) {
        System.out.println("📨 Raw message received: " + messageJson);
        
        try {
            Map<String, Object> messageMap = objectMapper.readValue(messageJson, Map.class);

            System.out.println("📨 Parsed message: " + messageMap);

            String email = (String) messageMap.get("email");
            String status = (String) messageMap.get("status");
            String reservationId = (String) messageMap.get("reservationId");
            String event = (String) messageMap.get("event");

            // Validate required fields
            if (email == null || email.isEmpty()) {
                System.err.println("❌ Email is missing in the message");
                return;
            }

            if (reservationId == null || reservationId.isEmpty()) {
                System.err.println("❌ Reservation ID is missing in the message");
                return;
            }

            System.out.println("📧 Preparing to send email to: " + email);
            System.out.println("   Event: " + event);
            System.out.println("   Status: " + status);
            System.out.println("   Reservation ID: " + reservationId);

            String qrFileName = null;
            try {
                String qrContent = buildQRContent(reservationId, event, status);
                System.out.println("🔲 Generating QR code with content: " + qrContent);
                
                qrFileName = QRCodeGenerator.generateQRCodeImage(
                    qrContent,
                    300,
                    300,
                    qrFolder
                );
                
                System.out.println("✅ QR code generated: " + qrFileName);
            } catch (Exception e) {
                System.err.println("❌ Failed to generate QR code: " + e.getMessage());
                e.printStackTrace();
            }

            String subject = buildSubject(event, status);
            String text = buildEmailBody(messageMap, event, status, reservationId);

            emailService.sendEmail(email, subject, text, null, qrFileName);
            
            System.out.println("✅ Email sent successfully to: " + email);
        } catch (MessagingException e) {
            System.err.println("❌ Failed to send email: " + e.getMessage());
            e.printStackTrace();
        } catch (Exception e) {
            System.err.println("❌ Error processing message: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private String buildQRContent(String reservationId, String event, String status) {
        StringBuilder content = new StringBuilder();
        
        if (event == null) {
            event = "UNKNOWN";
        }

        switch (event) {
            case "RESERVATION_CREATED":
                content.append("RESERVATION:").append(reservationId)
                       .append("|STATUS:PENDING")
                       .append("|TYPE:INITIAL");
                break;
            case "RESERVATION_CONFIRMED":
                content.append("RESERVATION:").append(reservationId)
                       .append("|STATUS:CONFIRMED")
                       .append("|TYPE:CHECK_IN");
                break;
            case "RESERVATION_CANCELLED":
                content.append("RESERVATION:").append(reservationId)
                       .append("|STATUS:CANCELLED")
                       .append("|TYPE:CANCELLED");
                break;
            default:
                content.append("RESERVATION:").append(reservationId)
                       .append("|STATUS:").append(status != null ? status : "UNKNOWN");
        }

        return content.toString();
    }

    private String buildSubject(String event, String status) {
        if (event == null) {
            return "Reservation " + (status != null ? status : "Update");
        }
        
        switch (event) {
            case "RESERVATION_CREATED":
                return "Reservation Created Successfully";
            case "RESERVATION_CONFIRMED":
                return "Reservation Confirmed";
            case "RESERVATION_CANCELLED":
                return "Reservation Cancelled";
            default:
                return "Reservation " + (status != null ? status : "Update");
        }
    }

    private String buildEmailBody(Map<String, Object> messageMap, String event, String status, String reservationId) {
        StringBuilder body = new StringBuilder();
        body.append("<html><body style='font-family: Arial, sans-serif;'>");
        body.append("<h2 style='color: #333;'>Reservation Update</h2>");
        body.append("<p>Dear Customer,</p>");

        if (event == null) {
            event = "UNKNOWN";
        }

        switch (event) {
            case "RESERVATION_CREATED":
                body.append("<p>Your reservation has been <strong>created successfully</strong>.</p>");
                body.append("<p><strong>Reservation ID:</strong> ").append(reservationId != null ? reservationId : "N/A").append("</p>");
                body.append("<p><strong>Status:</strong> ").append(status != null ? status : "N/A").append("</p>");
                
                Object amount = messageMap.get("amount");
                if (amount != null) {
                    body.append("<p><strong>Amount:</strong> LKR").append(amount).append("</p>");
                }
                
                Object stallId = messageMap.get("stallId");
                if (stallId != null) {
                    body.append("<p><strong>Stall ID:</strong> ").append(stallId).append("</p>");
                }
                
                Object reserveDate = messageMap.get("reserveDate");
                if (reserveDate != null) {
                    body.append("<p><strong>Reserved on:</strong> ").append(reserveDate).append("</p>");
                }
                
                body.append("<p>Please keep your QR code attached to this email for check-in.</p>");
                break;

            case "RESERVATION_CONFIRMED":
                body.append("<p>Your reservation has been <strong>confirmed</strong>!</p>");
                body.append("<p><strong>Reservation ID:</strong> ").append(reservationId != null ? reservationId : "N/A").append("</p>");
                
                Object confirmDate = messageMap.get("reserveConfirmDate");
                if (confirmDate != null) {
                    body.append("<p><strong>Confirmed on:</strong> ").append(confirmDate).append("</p>");
                }
                
                body.append("<p>Your updated QR code is attached. Please present it at the venue.</p>");
                break;

            case "RESERVATION_CANCELLED":
                body.append("<p>Your reservation has been <strong>cancelled</strong>.</p>");
                body.append("<p><strong>Reservation ID:</strong> ").append(reservationId != null ? reservationId : "N/A").append("</p>");
                body.append("<p>If you did not request this cancellation, please contact support immediately.</p>");
                break;

            default:
                body.append("<p>Your reservation with ID <strong>").append(reservationId != null ? reservationId : "N/A")
                    .append("</strong> is now <strong>").append(status != null ? status : "updated").append("</strong>.</p>");
        }

        body.append("<br>");
        body.append("<p>Thank you for choosing our service!</p>");
        body.append("<p style='color: #666; font-size: 12px;'>This is an automated message. Please do not reply.</p>");
        body.append("</body></html>");

        return body.toString();
    }
}