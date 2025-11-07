package com.example.reservation.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/")
    public String home() {
        return "Reservation Service is running 🚀";
    }

    @GetMapping("/health")
    public String healthCheck() {
        return "OK";
    }
}
