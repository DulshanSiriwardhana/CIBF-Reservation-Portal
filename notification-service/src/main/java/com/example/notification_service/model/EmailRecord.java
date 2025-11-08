package com.example.notificationservice.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "email_records")
public class EmailRecord {
    @Id
    private String id;
    private String toEmail;
    private String subject;
    private String message;
    private String attachmentName;
    private String qrData;
    private LocalDateTime sentAt;
}
