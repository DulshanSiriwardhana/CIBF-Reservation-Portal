package lk.bookfair.emailservice.service;

import lk.bookfair.emailservice.model.EmailRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailSenderService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(EmailRequest request) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(request.getTo());
        message.setSubject(request.getSubject());
        String text = request.getBody();

        if (request.getQrCodeUrl() != null && !request.getQrCodeUrl().isEmpty()) {
            text += "\n\nDownload your QR Pass: " + request.getQrCodeUrl();
        }

        message.setText(text);
        mailSender.send(message);
    }
}
