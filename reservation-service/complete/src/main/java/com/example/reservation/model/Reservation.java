package com.example.reservation.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reservations")
public class Reservation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String reservationId;
    
    @Column(nullable = false)
    private LocalDateTime reserveDate;
    
    @Column(nullable = false)
    private String status;
    
    @Column(nullable = false)
    private Double amount;
    
    @Column(nullable = false)
    private String stallId;
    
    private LocalDateTime reserveConfirmDate;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @OneToOne(mappedBy = "reservation", cascade = CascadeType.ALL, orphanRemoval = true)
    private QRCode qrCode;
    
    // Constructors
    public Reservation() {}
    
    public Reservation(LocalDateTime reserveDate, String status, Double amount, String stallId, User user) {
        this.reserveDate = reserveDate;
        this.status = status;
        this.amount = amount;
        this.stallId = stallId;
        this.user = user;
    }
    
    // Business methods
    public void confirmReservation() {
        this.status = "CONFIRMED";
        this.reserveConfirmDate = LocalDateTime.now();
    }
    
    public void cancelReservation() {
        this.status = "CANCELLED";
    }
    
    // Getters and Setters
    public String getReservationId() { return reservationId; }
    public void setReservationId(String reservationId) { this.reservationId = reservationId; }
    
    public LocalDateTime getReserveDate() { return reserveDate; }
    public void setReserveDate(LocalDateTime reserveDate) { this.reserveDate = reserveDate; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    
    public String getStallId() { return stallId; }
    public void setStallId(String stallId) { this.stallId = stallId; }
    
    public LocalDateTime getReserveConfirmDate() { return reserveConfirmDate; }
    public void setReserveConfirmDate(LocalDateTime reserveConfirmDate) { this.reserveConfirmDate = reserveConfirmDate; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public QRCode getQrCode() { return qrCode; }
    public void setQrCode(QRCode qrCode) { this.qrCode = qrCode; }
}