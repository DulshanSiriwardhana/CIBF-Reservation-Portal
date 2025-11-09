package com.example.notificationservice.config;

import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {
    public static final String RESERVATION_EMAIL_QUEUE = "reservation.email.queue";

    @Bean
    public Queue emailQueue() {
        return new Queue(RESERVATION_EMAIL_QUEUE, true);
    }
}
