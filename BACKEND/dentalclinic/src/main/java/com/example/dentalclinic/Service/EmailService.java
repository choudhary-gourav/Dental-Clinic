package com.example.dentalclinic.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Async
    public void sendEmail(String toEmail, String patientName, String doctorName, String date, String time) {
        try{
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Appointment Confirmation - Dental Care Clinic");
            message.setText("Dear " + patientName + ",\n\n" +
                    "Your appointment has been successfully confirmed!\n\n" +
                    "Appointment Details:\n" +
                    "- Doctor: " + doctorName + "\n" +
                    "- Date: " + date + "\n" +
                    "- Time: " + time + "\n\n" +
                    "Thank you for choosing Dental Care Clinic.\n\n" +
                    "Best regards,\nDental Care Team");
            mailSender.send(message);
            System.out.println("Confirmation email successfully sent to " + toEmail);

        }catch(Exception e){
            System.err.println("Failed to send the Email to the Patient: " + e.getMessage());
            e.printStackTrace();
        }
    }
}

