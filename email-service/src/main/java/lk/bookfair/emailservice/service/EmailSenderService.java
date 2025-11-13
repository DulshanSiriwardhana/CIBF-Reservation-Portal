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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;
import lk.bookfair.emailservice.model.EmailRequest;

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

        // Build rich email body using all provided fields
        StringBuilder emailText = new StringBuilder();

        emailText.append("Dear ").append(request.getBusinessName()).append(",\n\n")
                .append("Your reservation for the Colombo International Book Fair has been confirmed.\n\n")
                .append("Reservation Details:\n")
                .append("- Reservation ID: ").append(request.getReservationId()).append("\n")
                .append("- Status: ").append(request.getStatus()).append("\n")
                .append("- Reserved On: ").append(request.getReserveDate()).append("\n")
                .append("- Confirmed On: ").append(request.getReserveConfirmDate()).append("\n")
                .append("- Amount: Rs. ").append(request.getAmount()).append("\n\n")

                .append("Stall Details:\n")
                .append("- Stall ID: ").append(request.getStallId()).append("\n")
                .append("- Stall Name: ").append(request.getStallName()).append("\n")
                .append("- Stall Size: ").append(request.getStallSize()).append("\n")
                .append("- Location: ").append(request.getStallLocation()).append("\n\n")

                .append("Please find your QR pass attached with this email.\n")
                .append("Present it at the exhibition entrance for verification.\n\n")
                .append("Thank you,\n")
                .append("Sri Lanka Book Publishers’ Association\n\n")

                .append(request.getBody()); // Append any custom body text at the end

        helper.setText(emailText.toString());

        // QR Content in simple text format
        String qrContent = "BusinessName: " + request.getBusinessName() + "\n"
                + "ReservationID: " + request.getReservationId() + "\n"
                + "StallID:" + request.getStallId() +"\n"
                + "StallName: " + request.getStallName() + "\n"
                + "StallSize: " + request.getStallSize();


        byte[] qrBytes = qrGenerator.generateQR(qrContent);
        helper.addAttachment("QR-PASS.png", new ByteArrayResource(qrBytes));

        mailSender.send(message);
    }
}
