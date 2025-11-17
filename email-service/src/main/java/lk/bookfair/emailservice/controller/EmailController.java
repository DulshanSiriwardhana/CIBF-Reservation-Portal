//package lk.bookfair.emailservice.controller;
//
//import lk.bookfair.emailservice.model.EmailRequest;
//import lk.bookfair.emailservice.service.EmailSenderService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/email")
//@CrossOrigin
//public class EmailController {
//
//    @Autowired
//    private EmailSenderService emailSenderService;
//
//    @GetMapping("/")
//    public String home() {
//        return "Email Service is running!";
//    }
//
//    @PostMapping("/send")
//    public ResponseEntity<String> sendEmail(@RequestBody EmailRequest request) {
//        try {
//            emailSenderService.sendEmail(request);
//            return ResponseEntity.ok("Email sent successfully to " + request.getTo());
//        } catch (Exception e) {
//            return ResponseEntity.status(500).body("Failed to send email: " + e.getMessage());
//        }
//    }
//}

package lk.bookfair.emailservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lk.bookfair.emailservice.model.EmailRequest;
import lk.bookfair.emailservice.service.EmailSenderService;

@RestController
@RequestMapping("/api/email")
@CrossOrigin
public class EmailController {

    @Autowired
    private EmailSenderService emailSenderService;

    @GetMapping({"","/"})
    public String home() {
        return "Email Service is running!";
    }
    @PostMapping("/send")
    public ResponseEntity<?> sendEmail(@RequestBody EmailRequest request) {
        try {
            emailSenderService.sendEmailWithQR(request);
            return ResponseEntity.ok("Reservation email sent successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed: " + e.getMessage());
        }
    }
}
