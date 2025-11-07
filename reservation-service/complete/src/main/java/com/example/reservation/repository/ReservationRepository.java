package com.example.reservation.repository;

import com.example.reservation.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, String> {
    List<Reservation> findByUserId(String userId);
    List<Reservation> findByStatus(String status);
    List<Reservation> findByStallId(String stallId);
    List<Reservation> findByReserveDateBetween(LocalDateTime start, LocalDateTime end);
}