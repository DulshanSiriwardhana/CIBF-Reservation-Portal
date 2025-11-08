package com.example.reservation.service;

import com.example.reservation.config.RabbitMQConfig;
import com.example.reservation.exception.ResourceNotFoundException;
import com.example.reservation.model.Reservation;
import com.example.reservation.repository.ReservationRepository;
import com.example.reservation.util.QRCodeGenerator;
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
    private final String qrFolder = "qrcodes";

    public Reservation createReservation(Reservation reservation) {
        reservation.setReserveDate(LocalDateTime.now());
        reservation.setStatus("PENDING");
        Reservation saved = reservationRepository.save(reservation);

        try {
            String qrFile = QRCodeGenerator.generateQRCodeImage(
                    "reservation:" + saved.getReservationId(),
                    300,
                    300,
                    qrFolder
            );
            saved.setQrId(qrFile);
            saved = reservationRepository.save(saved);
        } catch (Exception e) {
            e.printStackTrace();
        }

        Map<String, Object> payload = new HashMap<>();
        payload.put("event", "RESERVATION_CREATED");
        payload.put("reservationId", saved.getReservationId());
        payload.put("userId", saved.getUserId());
        payload.put("email", saved.getEmail());
        payload.put("status", saved.getStatus());
        payload.put("amount", saved.getAmount());
        payload.put("stallId", saved.getStallId());
        payload.put("reserveDate", saved.getReserveDate() != null ? saved.getReserveDate().toString() : null);
        payload.put("qrId", saved.getQrId());

        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE, RabbitMQConfig.ROUTING_KEY_CREATED, payload);

        return saved;
    }

    public Reservation confirmReservation(String id) {
        Reservation res = getReservationById(id);
        res.setStatus("CONFIRMED");
        res.setReserveConfirmDate(LocalDateTime.now());

        try {
            String qrFile = QRCodeGenerator.generateQRCodeImage(
                    "reservation_confirmed:" + res.getReservationId(),
                    300,
                    300,
                    qrFolder
            );
            res.setQrId(qrFile);
        } catch (Exception e) {
            e.printStackTrace();
        }

        Reservation updated = reservationRepository.save(res);

        Map<String, Object> payload = new HashMap<>();
        payload.put("event", "RESERVATION_CONFIRMED");
        payload.put("reservationId", updated.getReservationId());
        payload.put("userId", updated.getUserId());
        payload.put("email", updated.getEmail());
        payload.put("status", updated.getStatus());
        payload.put("reserveConfirmDate", updated.getReserveConfirmDate() != null ? updated.getReserveConfirmDate().toString() : null);
        payload.put("qrId", updated.getQrId());

        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE, RabbitMQConfig.ROUTING_KEY_CONFIRMED, payload);

        return updated;
    }

    public Reservation cancelReservation(String id) {
        Reservation res = getReservationById(id);
        res.setStatus("CANCELLED");
        Reservation updated = reservationRepository.save(res);

        Map<String, Object> payload = new HashMap<>();
        payload.put("event", "RESERVATION_CANCELLED");
        payload.put("reservationId", updated.getReservationId());
        payload.put("userId", updated.getUserId());
        payload.put("email", updated.getEmail());
        payload.put("status", updated.getStatus());

        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE, RabbitMQConfig.ROUTING_KEY_CANCELLED, payload);

        return updated;
    }

    public Reservation getReservationById(String id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));
    }

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }
}
