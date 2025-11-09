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

            System.out.print(messageJson);

            String email = (String) messageMap.get("email");
            String status = (String) messageMap.get("status");
            String reservationId = (String) messageMap.get("reservationId");
            String qrData = (String) messageMap.get("qrData");

            String subject = "Reservation " + status;
            String text = "Dear user,<br>Your reservation with ID <b>" + reservationId +
                    "</b> is now <b>" + status + "</b>.";

            //emailService.sendEmail(email, subject, text, null, qrData);

            emailService.sendEmail(email, "test", "testing", null, "test drData");
            System.out.println("✅ Email sent successfully to: " + email);
        } catch (MessagingException e) {
            System.err.println("❌ Failed to send email: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("❌ Error processing message: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
