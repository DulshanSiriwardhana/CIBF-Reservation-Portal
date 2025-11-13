package com.cibf.stallservice.event;

import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class StallEventPublisher {

    private final RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.exchange.stall:stall.exchange}")
    private String stallExchange;

    @Value("${rabbitmq.routing-key.stall-reserved:stall.reserved}")
    private String stallReservedRoutingKey;

    @Value("${rabbitmq.routing-key.stall-released:stall.released}")
    private String stallReleasedRoutingKey;

    public StallEventPublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void publishStallReservedEvent(StallReservedEvent event) {
        try {
            log.info("Publishing stall reserved event for stall: {}", event.getStallId());
            rabbitTemplate.convertAndSend(stallExchange, stallReservedRoutingKey, event);
            log.info("Stall reserved event published successfully");
        } catch (Exception e) {
            log.error("Error publishing stall reserved event: {}", e.getMessage(), e);
        }
    }

    public void publishStallReleasedEvent(StallReleasedEvent event) {
        try {
            log.info("Publishing stall released event for stall: {}", event.getStallId());
            rabbitTemplate.convertAndSend(stallExchange, stallReleasedRoutingKey, event);
            log.info("Stall released event published successfully");
        } catch (Exception e) {
            log.error("Error publishing stall released event: {}", e.getMessage(), e);
        }
    }
}