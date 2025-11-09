package com.example.notificationservice.service;

import com.example.notificationservice.model.EmailRecord;
import com.example.notificationservice.repository.EmailRecordRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.File;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final EmailRecordRepository repository;

    @Value("${qrcode.folder:qrcodes}")
    private String qrFolder;

    @Value("${spring.mail.username:noreply@example.com}")
    private String fromEmail;

    public void sendEmail(String to, String subject, String message, String attachmentPath, String qrFileName) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(message, true);

        String attachmentName = null;

        if (attachmentPath != null && !attachmentPath.isEmpty()) {
            File file = new File(attachmentPath);
            if (file.exists()) {
                FileSystemResource fileResource = new FileSystemResource(file);
                helper.addAttachment(fileResource.getFilename(), fileResource);
                attachmentName = fileResource.getFilename();
            }
        }

        if (qrFileName != null && !qrFileName.isEmpty()) {
            File qrFile = new File(qrFolder, qrFileName);
            if (qrFile.exists()) {
                FileSystemResource qrResource = new FileSystemResource(qrFile);
                helper.addAttachment("QRCode.png", qrResource);
                if (attachmentName == null) {
                    attachmentName = "QRCode.png";
                }
            } else {
                System.err.println("QR code file not found: " + qrFile.getAbsolutePath());
            }
        }

        mailSender.send(mimeMessage);

        EmailRecord record = new EmailRecord();
        record.setToEmail(to);
        record.setSubject(subject);
        record.setMessage(message);
        record.setAttachmentName(attachmentName);
        record.setQrData(qrFileName);
        record.setSentAt(LocalDateTime.now());
        repository.save(record);
    }
}