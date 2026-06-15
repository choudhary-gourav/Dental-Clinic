package com.example.dentalclinic.Controller;

import com.example.dentalclinic.DTO.PatientRequest;
import com.example.dentalclinic.DTO.PatientResponse;
import com.example.dentalclinic.Service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/patient")

public class PatientController {
    @Autowired
    PatientService pservice;

    @PostMapping("/create/{userId}")
    public ResponseEntity<PatientResponse> createPatient(
            @PathVariable Long userId,
            @RequestBody PatientRequest request) {

        PatientResponse response = pservice.createPatient(request, userId);
        return ResponseEntity.ok(response);
    }
    @GetMapping("/{patientId}")
    public ResponseEntity<PatientResponse> getPatientById(
            @PathVariable Long patientId) {

        PatientResponse response = pservice.getPatientById(patientId);
        return ResponseEntity.ok(response);
    }


    @GetMapping("/email/{email}")
    public ResponseEntity<PatientResponse> getPatientByEmail(
            @PathVariable String email) {

        PatientResponse response = pservice.getPatientByEmail(email);
        return ResponseEntity.ok(response);
    }


    @GetMapping("/allpatient")
    public ResponseEntity<List<PatientResponse>> getAllPatients() {

        List<PatientResponse> patients = pservice.getAllPatients();
        return ResponseEntity.ok(patients);
    }


    @PutMapping("/{patientId}")
    public ResponseEntity<PatientResponse> updatePatient(
            @PathVariable Long patientId,
            @RequestBody PatientRequest request) {

        PatientResponse response = pservice.updatePatient(patientId, request);
        return ResponseEntity.ok(response);
    }


    @DeleteMapping("/{patientId}")
    public ResponseEntity<String> deletePatient(
            @PathVariable Long patientId) {

        String message = pservice.deletePatient(patientId);
        return ResponseEntity.ok(message);
    }

}
