package com.example.reservation.service;

import com.example.reservation.model.QRCode;
import com.example.reservation.model.Reservation;
import com.example.reservation.model.User;
import com.example.reservation.repository.QRCodeRepository;
import com.example.reservation.repository.ReservationRepository;
import com.example.reservation.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReservationService {
    
    @Autowired
    private ReservationRepository reservationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private QRCodeRepository qrCodeRepository;
    
    @Autowired
    private EmailService emailService;
    
    @Transactional
    public Reservation createReservation(String userId, LocalDateTime reserveDate, Double amount, String stallId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Reservation reservation = new Reservation(reserveDate, "PENDING", amount, stallId, user);
        reservation = reservationRepository.save(reservation);
        
        return reservation;
    }
    
    @Transactional
    public Reservation confirmReservation(String reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
            .orElseThrow(() -> new RuntimeException("Reservation not found"));
        
        reservation.confirmReservation();
        reservation = reservationRepository.save(reservation);
        
        // Generate QR Code
        QRCode qrCode = new QRCode();
        qrCode.setReservation(reservation);
        String generatedCode = qrCode.generateQR();
        qrCode.setCode(generatedCode);
        qrCodeRepository.save(qrCode);
        
        // Send confirmation email
        emailService.sendConfirmationEmail(reservation);
        
        return reservation;
    }
    
    @Transactional
    public Reservation cancelReservation(String reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
            .orElseThrow(() -> new RuntimeException("Reservation not found"));
        
        reservation.cancelReservation();
        return reservationRepository.save(reservation);
    }
    
    public Reservation getReservationById(String reservationId) {
        return reservationRepository.findById(reservationId)
            .orElseThrow(() -> new RuntimeException("Reservation not found"));
    }
    
    public List<Reservation> getReservationsByUserId(String userId) {
        return reservationRepository.findByUserId(userId);
    }
    
    public List<Reservation> getReservationsByStatus(String status) {
        return reservationRepository.findByStatus(status);
    }
    
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }
    
    public QRCode getQRCodeByReservationId(String reservationId) {
        return qrCodeRepository.findByReservationId(reservationId)
            .orElseThrow(() -> new RuntimeException("QR Code not found for reservation"));
    }
}