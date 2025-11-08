package com.example.notificationservice.consumer;

import com.example.notificationservice.config.RabbitMQConfig;
import com.example.notificationservice.dto.EmailMessageDTO;
import com.example.notificationservice.service.EmailService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EmailConsumer {

    private final EmailService emailService;
    private final ObjectMapper objectMapper;

    @RabbitListener(queues = RabbitMQConfig.RESERVATION_EMAIL_QUEUE)
    public void consumeMessage(String messageJson) {
        try {
            EmailMessageDTO dto = objectMapper.readValue(messageJson, EmailMessageDTO.class);
            emailService.sendEmail(
                    dto.getTo(),
                    dto.getSubject(),
                    dto.getMessage(),
                    dto.getAttachmentPath(),
                    dto.getQrData()
            );
            System.out.println("Email sent to: " + dto.getTo());
        } catch (MessagingException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
