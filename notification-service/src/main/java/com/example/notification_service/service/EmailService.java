package com.example.notificationservice.service;

import com.example.notificationservice.model.EmailRecord;
import com.example.notificationservice.repository.EmailRecordRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
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

    public void sendEmail(String to, String subject, String message, String attachmentPath, String qrData) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);

        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(message);

        String attachmentName = null;
        if (attachmentPath != null) {
            FileSystemResource file = new FileSystemResource(new File(attachmentPath));
            helper.addAttachment(file.getFilename(), file);
            attachmentName = file.getFilename();
        }

        mailSender.send(mimeMessage);

        EmailRecord record = new EmailRecord();
        record.setToEmail(to);
        record.setSubject(subject);
        record.setMessage(message);
        record.setAttachmentName(attachmentName);
        record.setQrData(qrData);
        record.setSentAt(LocalDateTime.now());

        repository.save(record);
    }
}
