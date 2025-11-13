package com.cibf.stallservice.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.amqp.core.Queue;

@Configuration
public class RabbitMQConfig {
    @Value("${rabbitmq.exchange.stall:stall.exchange}")
    private String stallExchange;

    @Value("${rabbitmq.queue.stall-reserved:stall.reserved.queue}")
    private String stallReservedQueue;

    @Value("${rabbitmq.queue.stall-released:stall.released.queue}")
    private String stallReleasedQueue;

    @Value("${rabbitmq.routing-key.stall-reserved:stall.reserved}")
    private String stallReservedRoutingKey;

    @Value("${rabbitmq.routing-key.stall-released:stall.released}")
    private String stallReleasedRoutingKey;

    // Exchange
    @Bean
    public TopicExchange stallExchange() {
        return new TopicExchange(stallExchange);
    }

    // Queues
    @Bean
    public Queue stallReservedQueue() {
        return new Queue(stallReservedQueue, true);
    }

    @Bean
    public Queue stallReleasedQueue() {
        return new Queue(stallReleasedQueue, true);
    }

    // Bindings
    @Bean
    public Binding stallReservedBinding() {
        return BindingBuilder
                .bind(stallReservedQueue())
                .to(stallExchange())
                .with(stallReservedRoutingKey);
    }

    @Bean
    public Binding stallReleasedBinding() {
        return BindingBuilder
                .bind(stallReleasedQueue())
                .to(stallExchange())
                .with(stallReleasedRoutingKey);
    }

    // Message Converter
    @Bean
    public MessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    // RabbitTemplate
    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(messageConverter());
        return template;
    }
}
