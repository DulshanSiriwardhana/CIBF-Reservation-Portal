package com.example.reservation.service;

import com.example.reservation.config.RabbitMQConfig;
import com.example.reservation.exception.ResourceNotFoundException;
import com.example.reservation.model.Reservation;
import com.example.reservation.repository.ReservationRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final RabbitTemplate rabbitTemplate;
    private final ObjectMapper objectMapper;

    public Reservation createReservation(Reservation reservation) {
        reservation.setReserveDate(LocalDateTime.now());
        reservation.setStatus("PENDING");
        Reservation saved = reservationRepository.save(reservation);

        System.out.println("💾 Reservation saved: " + saved.getReservationId());
        
        sendNotification(saved, "RESERVATION_CREATED", RabbitMQConfig.ROUTING_KEY_CREATED);
        return saved;
    }

    public Reservation confirmReservation(String id) {
        Reservation res = getReservationById(id);
        res.setStatus("CONFIRMED");
        res.setReserveConfirmDate(LocalDateTime.now());

        Reservation updated = reservationRepository.save(res);
        System.out.println("✅ Reservation confirmed: " + updated.getReservationId());
        
        sendNotification(updated, "RESERVATION_CONFIRMED", RabbitMQConfig.ROUTING_KEY_CONFIRMED);
        return updated;
    }

    public Reservation cancelReservation(String id) {
        Reservation res = getReservationById(id);
        res.setStatus("CANCELLED");
        Reservation updated = reservationRepository.save(res);
        
        System.out.println("❌ Reservation cancelled: " + updated.getReservationId());
        
        sendNotification(updated, "RESERVATION_CANCELLED", RabbitMQConfig.ROUTING_KEY_CANCELLED);
        return updated;
    }

    private void sendNotification(Reservation reservation, String event, String routingKey) {
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("event", event);
            payload.put("reservationId", reservation.getReservationId());
            payload.put("userId", reservation.getUserId());
            payload.put("email", reservation.getEmail());
            payload.put("status", reservation.getStatus());
            payload.put("amount", reservation.getAmount());
            payload.put("stallId", reservation.getStallId());
            payload.put("reserveDate", reservation.getReserveDate() != null ? reservation.getReserveDate().toString() : null);
            payload.put("reserveConfirmDate", reservation.getReserveConfirmDate() != null ? reservation.getReserveConfirmDate().toString() : null);

            String jsonMessage = objectMapper.writeValueAsString(payload);
            
            System.out.println("📤 Sending notification to RabbitMQ");
            System.out.println("   Event: " + event);
            System.out.println("   Exchange: " + RabbitMQConfig.EXCHANGE);
            System.out.println("   Routing Key: " + routingKey);
            System.out.println("   Payload: " + jsonMessage);
            
            rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE, routingKey, jsonMessage);
            
            System.out.println("✅ Notification sent successfully");
        } catch (JsonProcessingException e) {
            System.err.println("❌ Failed to serialize message: " + e.getMessage());
            e.printStackTrace();
        } catch (Exception e) {
            System.err.println("❌ Failed to send notification: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public Reservation getReservationById(String id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));
    }

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }
}