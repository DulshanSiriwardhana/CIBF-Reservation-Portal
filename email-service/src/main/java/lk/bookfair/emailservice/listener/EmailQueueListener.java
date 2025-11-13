package lk.bookfair.emailservice.listener;

import lk.bookfair.emailservice.model.EmailRequest;
import lk.bookfair.emailservice.service.EmailSenderService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class EmailQueueListener {

    @Autowired
    private EmailSenderService emailSenderService;

    @RabbitListener(queues = "${email.queue.name}")
    public void receiveEmailRequest(EmailRequest request) {
        try {
            emailSenderService.sendEmailWithQR(request);
            System.out.println("✅ Email sent successfully to: " + request.getTo());
        } catch (Exception e) {
            System.err.println("❌ Failed to send email: " + e.getMessage());
        }
    }
}
