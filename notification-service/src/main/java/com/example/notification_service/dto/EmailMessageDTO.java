package com.example.notificationservice.dto;

import lombok.Data;

@Data
public class EmailMessageDTO {
    private String to;
    private String subject;
    private String message;
    private String qrData;
    private String attachmentPath;
}
