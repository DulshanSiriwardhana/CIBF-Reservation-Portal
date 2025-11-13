package com.example.reservation.repository;

import com.example.reservation.model.Reservation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservationRepository extends MongoRepository<Reservation, String> {
    
    // Find all reservations by userId
    List<Reservation> findByUserId(String userId);
    
    // Find active reservations (not cancelled) by userId
    List<Reservation> findByUserIdAndStatusNot(String userId, String status);
    
    // Count active reservations for a user
    long countByUserIdAndStatusNot(String userId, String status);
    
    // Find by userId and status
    List<Reservation> findByUserIdAndStatus(String userId, String status);
}