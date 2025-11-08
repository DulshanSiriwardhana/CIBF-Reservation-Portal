package com.example.notificationservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "email_records")
@Data
@AllArgsConstructor
@NoArgsConstructor
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
