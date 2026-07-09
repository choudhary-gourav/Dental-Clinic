package com.example.dentalclinic.Controller;

import com.example.dentalclinic.Repository.AppointmentRepository;
import com.example.dentalclinic.Repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PatientRepository patientRepository;

    @PostMapping("/reset")
    public ResponseEntity<String> resetDatabase() {
        appointmentRepository.deleteAll();
        patientRepository.deleteAll();
        return ResponseEntity.ok("Database reset completed successfully.");
    }
}
