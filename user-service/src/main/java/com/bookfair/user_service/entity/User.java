package com.bookfair.user_service.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "UUID")
    private UUID userId;
    
    @NotBlank(message = "Username is required")
    @Column(unique = true, nullable = false)
    private String username;
    
    @NotBlank(message = "Password is required")
    @Column(nullable = false)
    private String password;
    
    @Email(message = "Email should be valid")
    @NotBlank(message = "Email is required")
    @Column(unique = true, nullable = false)
    private String email;
    
    @NotBlank(message = "Role is required")
    @Column(nullable = false)
    private String role; // VENDOR or EMPLOYEE
    
    @NotBlank(message = "Business name is required")
    @Column(nullable = false)
    private String businessName;
    
    @Pattern(regexp = "^[0-9]{10}$", message = "Contact number must be 10 digits")
    @Column(nullable = false)
    private String contactNumber;
    
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}