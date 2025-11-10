package com.bookfair.user_service.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bookfair.user_service.dto.AuthResponse;
import com.bookfair.user_service.dto.LoginRequest;
import com.bookfair.user_service.dto.RegisterRequest;
import com.bookfair.user_service.dto.UpdateProfileRequest;
import com.bookfair.user_service.dto.UserResponse;
import com.bookfair.user_service.entity.User;
import com.bookfair.user_service.repository.UserRepository;
import com.bookfair.user_service.security.JwtUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    
    @Transactional
    public AuthResponse registerUser(RegisterRequest request) {
        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        // Create new user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setRole(request.getRole());
        user.setBusinessName(request.getBusinessName());
        user.setContactNumber(request.getContactNumber());
        
        User savedUser = userRepository.save(user);
        
        // Generate JWT token
        String token = jwtUtil.generateToken(savedUser.getUsername(), savedUser.getUserId(), savedUser.getRole());
        
        return new AuthResponse(
                token,
                savedUser.getUserId().toString(),
                savedUser.getUsername(),
                savedUser.getEmail(),
                savedUser.getRole(),
                "User registered successfully"
        );
    }
    
    public AuthResponse loginUser(LoginRequest request) {
        // Authenticate user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        
        // Get user details
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Generate JWT token
        String token = jwtUtil.generateToken(user.getUsername(), user.getUserId(), user.getRole());
        
        return new AuthResponse(
                token,
                user.getUserId().toString(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                "Login successful"
        );
    }
    
    @Transactional
    public UserResponse updateProfile(UpdateProfileRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Update fields if provided
        if (request.getEmail() != null && !request.getEmail().isEmpty()) {
            // Check if email is already taken by another user
            if (userRepository.existsByEmail(request.getEmail()) && 
                !user.getEmail().equals(request.getEmail())) {
                throw new RuntimeException("Email already exists");
            }
            user.setEmail(request.getEmail());
        }
        
        if (request.getBusinessName() != null && !request.getBusinessName().isEmpty()) {
            user.setBusinessName(request.getBusinessName());
        }
        
        if (request.getContactNumber() != null && !request.getContactNumber().isEmpty()) {
            user.setContactNumber(request.getContactNumber());
        }
        
        User updatedUser = userRepository.save(user);
        
        return new UserResponse(
                updatedUser.getUserId().toString(),
                updatedUser.getUsername(),
                updatedUser.getEmail(),
                updatedUser.getRole(),
                updatedUser.getBusinessName(),
                updatedUser.getContactNumber()
        );
    }
    
    public UserResponse getUserDetails() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return new UserResponse(
                user.getUserId().toString(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.getBusinessName(),
                user.getContactNumber()
        );
    }
    
    public UserResponse getUserById(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return new UserResponse(
                user.getUserId().toString(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.getBusinessName(),
                user.getContactNumber()
        );
    }
}