package com.example.reservation.controller;

import com.example.reservation.dto.ReservationRequest;
import com.example.reservation.dto.ReservationResponse;
import com.example.reservation.model.QRCode;
import com.example.reservation.model.Reservation;
import com.example.reservation.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {
    
    @Autowired
    private ReservationService reservationService;
    
    @PostMapping
    public ResponseEntity<ReservationResponse> createReservation(@RequestBody ReservationRequest request) {
        Reservation reservation = reservationService.createReservation(
            request.getUserId(),
            request.getReserveDate(),
            request.getAmount(),
            request.getStallId()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(reservation));
    }
    
    @PutMapping("/{id}/confirm")
    public ResponseEntity<ReservationResponse> confirmReservation(@PathVariable String id) {
        Reservation reservation = reservationService.confirmReservation(id);
        return ResponseEntity.ok(toResponse(reservation));
    }
    
    @PutMapping("/{id}/cancel")
    public ResponseEntity<ReservationResponse> cancelReservation(@PathVariable String id) {
        Reservation reservation = reservationService.cancelReservation(id);
        return ResponseEntity.ok(toResponse(reservation));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ReservationResponse> getReservation(@PathVariable String id) {
        Reservation reservation = reservationService.getReservationById(id);
        return ResponseEntity.ok(toResponse(reservation));
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReservationResponse>> getReservationsByUser(@PathVariable String userId) {
        List<Reservation> reservations = reservationService.getReservationsByUserId(userId);
        return ResponseEntity.ok(reservations.stream().map(this::toResponse).collect(Collectors.toList()));
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<ReservationResponse>> getReservationsByStatus(@PathVariable String status) {
        List<Reservation> reservations = reservationService.getReservationsByStatus(status);
        return ResponseEntity.ok(reservations.stream().map(this::toResponse).collect(Collectors.toList()));
    }
    
    @GetMapping
    public ResponseEntity<List<ReservationResponse>> getAllReservations() {
        List<Reservation> reservations = reservationService.getAllReservations();
        return ResponseEntity.ok(reservations.stream().map(this::toResponse).collect(Collectors.toList()));
    }
    
    @GetMapping("/{id}/qrcode")
    public ResponseEntity<QRCode> getQRCode(@PathVariable String id) {
        QRCode qrCode = reservationService.getQRCodeByReservationId(id);
        return ResponseEntity.ok(qrCode);
    }
    
    private ReservationResponse toResponse(Reservation reservation) {
        ReservationResponse response = new ReservationResponse();
        response.setReservationId(reservation.getReservationId());
        response.setReserveDate(reservation.getReserveDate());
        response.setStatus(reservation.getStatus());
        response.setAmount(reservation.getAmount());
        response.setStallId(reservation.getStallId());
        response.setReserveConfirmDate(reservation.getReserveConfirmDate());
        response.setUserId(reservation.getUser().getUserId());
        response.setUsername(reservation.getUser().getUsername());
        return response;
    }
}