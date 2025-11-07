package com.example.reservation.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String EXCHANGE = "reservation.exchange";
    public static final String ROUTING_KEY_CREATED = "reservation.created";
    public static final String ROUTING_KEY_CONFIRMED = "reservation.confirmed";
    public static final String ROUTING_KEY_CANCELLED = "reservation.cancelled";
    public static final String QUEUE_EMAIL = "reservation.email.queue";

    @Bean
    public TopicExchange reservationExchange() {
        return new TopicExchange(EXCHANGE);
    }

    @Bean
    public Queue reservationQueue() {
        return new Queue(QUEUE_EMAIL, true);
    }

    @Bean
    public Binding bindingCreated(Queue reservationQueue, TopicExchange reservationExchange) {
        return BindingBuilder.bind(reservationQueue).to(reservationExchange).with(ROUTING_KEY_CREATED);
    }

    @Bean
    public Binding bindingConfirmed(Queue reservationQueue, TopicExchange reservationExchange) {
        return BindingBuilder.bind(reservationQueue).to(reservationExchange).with(ROUTING_KEY_CONFIRMED);
    }

    @Bean
    public Binding bindingCancelled(Queue reservationQueue, TopicExchange reservationExchange) {
        return BindingBuilder.bind(reservationQueue).to(reservationExchange).with(ROUTING_KEY_CANCELLED);
    }
}
