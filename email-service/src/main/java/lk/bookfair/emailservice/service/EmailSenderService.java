//package lk.bookfair.emailservice.service;
//
//import lk.bookfair.emailservice.model.EmailRequest;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.mail.SimpleMailMessage;
//import org.springframework.mail.javamail.JavaMailSender;
//import org.springframework.stereotype.Service;
//
//@Service
//public class EmailSenderService {
//
//    @Autowired
//    private JavaMailSender mailSender;
//
//    public void sendEmail(EmailRequest request) {
//        SimpleMailMessage message = new SimpleMailMessage();
//        message.setTo(request.getTo());
//        message.setSubject(request.getSubject());
//        String text = request.getBody();
//
//        if (request.getQrCodeUrl() != null && !request.getQrCodeUrl().isEmpty()) {
//            text += "\n\nDownload your QR Pass: " + request.getQrCodeUrl();
//        }
//
//        message.setText(text);
//        mailSender.send(message);
//    }
//}

package lk.bookfair.emailservice.service;

import lk.bookfair.emailservice.model.EmailRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

//import javax.mail.internet.MimeMessage;
import jakarta.mail.internet.MimeMessage;


@Service
public class EmailSenderService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private QRGenerator qrGenerator;

    public void sendEmailWithQR(EmailRequest request) throws Exception {

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(request.getTo());
        helper.setSubject(request.getSubject());
        helper.setText(
                request.getBody() +
                        "\n\nReservation ID: " + request.getReservationId() +
                        "\nStall: " + request.getStallName()
        );

        // QR content (unique)
        String qrContent = "Reservation ID: " + request.getReservationId();

        byte[] qrBytes = qrGenerator.generateQR(qrContent);
        helper.addAttachment("QR-PASS.png", new ByteArrayResource(qrBytes));

        mailSender.send(message);
    }
}
