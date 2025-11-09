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
        System.out.println("=== EMAIL SERVICE ===");
        System.out.println("📧 Sending to: " + to);
        System.out.println("📧 Subject: " + subject);
        System.out.println("📧 From: " + fromEmail);
        
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
                System.out.println("✅ Regular attachment added: " + fileResource.getFilename());
            } else {
                System.err.println("⚠️  Regular attachment file not found: " + file.getAbsolutePath());
            }
        }

        if (qrFileName != null && !qrFileName.isEmpty()) {
            File qrFile = new File(qrFolder, qrFileName);
            
            System.out.println("📊 QR Code Details:");
            System.out.println("   Folder: " + qrFolder);
            System.out.println("   Filename: " + qrFileName);
            System.out.println("   Full Path: " + qrFile.getAbsolutePath());
            System.out.println("   Exists: " + qrFile.exists());
            System.out.println("   Size: " + (qrFile.exists() ? qrFile.length() + " bytes" : "N/A"));
            
            if (qrFile.exists() && qrFile.isFile()) {
                try {
                    FileSystemResource qrResource = new FileSystemResource(qrFile);
                    helper.addAttachment("QRCode.png", qrResource);
                    if (attachmentName == null) {
                        attachmentName = "QRCode.png";
                    }
                    System.out.println("✅ QR code attached: " + qrFile.getAbsolutePath());
                } catch (Exception e) {
                    System.err.println("❌ Error attaching QR code: " + e.getMessage());
                    e.printStackTrace();
                }
            } else {
                System.err.println("❌ QR code file not found: " + qrFile.getAbsolutePath());
                
                File qrDir = new File(qrFolder);
                if (qrDir.exists() && qrDir.isDirectory()) {
                    System.out.println("📁 Available files in " + qrDir.getAbsolutePath() + ":");
                    File[] files = qrDir.listFiles();
                    if (files != null && files.length > 0) {
                        for (File f : files) {
                            System.out.println("   - " + f.getName());
                        }
                    } else {
                        System.out.println("   (directory is empty)");
                    }
                }
            }
        }

        try {
            mailSender.send(mimeMessage);
            System.out.println("✅ Email sent successfully!");
        } catch (Exception e) {
            System.err.println("❌ Failed to send email: " + e.getMessage());
            throw e;
        }

        try {
            EmailRecord record = new EmailRecord();
            record.setToEmail(to);
            record.setSubject(subject);
            record.setMessage(message);
            record.setAttachmentName(attachmentName);
            record.setQrData(qrFileName);
            record.setSentAt(LocalDateTime.now());
            
            EmailRecord saved = repository.save(record);
            System.out.println("💾 Email record saved with ID: " + saved.getId());
        } catch (Exception e) {
            System.err.println("❌ Failed to save email record: " + e.getMessage());
            e.printStackTrace();
        }
        
        System.out.println("=== END EMAIL SERVICE ===");
    }
}