package com.example.notificationservice.controller;

import com.example.notificationservice.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.mail.MessagingException;
import java.io.File;
import java.io.IOException;

@RestController
@RequestMapping("/api/email")
@RequiredArgsConstructor
public class EmailController {

    private final EmailService emailService;

    @PostMapping("/send")
    public ResponseEntity<String> sendEmail(
            @RequestParam String to,
            @RequestParam String subject,
            @RequestParam String message,
            @RequestParam(required = false) MultipartFile attachment,
            @RequestParam(required = false) String qrData
    ) throws MessagingException, IOException {

        String attachmentPath = null;
        if (attachment != null) {
            File tempFile = File.createTempFile("attach-", attachment.getOriginalFilename());
            attachment.transferTo(tempFile);
            attachmentPath = tempFile.getAbsolutePath();
        }

        emailService.sendEmail(to, subject, message, attachmentPath, qrData);

        return ResponseEntity.ok("Email sent successfully!");
    }
}
