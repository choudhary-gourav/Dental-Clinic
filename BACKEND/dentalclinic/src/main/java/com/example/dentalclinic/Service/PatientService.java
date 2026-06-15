package com.example.dentalclinic.Service;

import com.example.dentalclinic.DTO.PatientRequest;
import com.example.dentalclinic.DTO.PatientResponse;
import com.example.dentalclinic.Entity.Patient;
import com.example.dentalclinic.Entity.User;
import com.example.dentalclinic.Repository.PatientRepository;
import com.example.dentalclinic.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class PatientService {

    @Autowired
    PatientRepository patientRepository;

    @Autowired
    UserRepository userRepository;

    public PatientResponse createPatient(PatientRequest request, Long patentId) {
        User user = userRepository.findById(patentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (!user.getEmail().equals(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Patient email must match user email");
        }

        if (patientRepository.existsByUserId(patentId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Patient already exists for this user");
        }

        if (patientRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Patient email already exists");
        }

        Patient patient = new Patient();
        applyRequest(patient, request);
        patient.setUser(user);

        return mapToResponse(patientRepository.save(patient));
    }

    public PatientResponse getPatientById(Long patientId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found"));
        return mapToResponse(patient);
    }

    public PatientResponse getPatientByEmail(String email) {
        Patient patient = patientRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found"));
        return mapToResponse(patient);
    }

    public List<PatientResponse> getAllPatients() {
        return patientRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public PatientResponse updatePatient(Long patientId, PatientRequest request) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found"));

        if (patient.getUser() != null && !patient.getUser().getEmail().equals(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Patient email must match user email");
        }

        if (!patient.getEmail().equals(request.getEmail())
                && patientRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Patient email already exists");
        }

        applyRequest(patient, request);
        return mapToResponse(patientRepository.save(patient));
    }

    public String deletePatient(Long patient_Id) {
        Patient patient = patientRepository.findById(patient_Id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found"));

        patientRepository.delete(patient);
        return "Patient deleted successfully";
    }

    private void applyRequest(Patient patient, PatientRequest request) {
        patient.setFirstName(request.getFirstName());
        patient.setLastName(request.getLastName());
        patient.setEmail(request.getEmail());
        patient.setPhone(request.getPhone());
        patient.setAge(request.getAge());
        patient.setDob(request.getDob());
        patient.setGender(request.getGender());
        patient.setAddress(request.getAddress());
    }

    private PatientResponse mapToResponse(Patient patient) {
        PatientResponse response = new PatientResponse();
        response.setFirstName(patient.getFirstName());
        response.setLastName(patient.getLastName());
        response.setEmail(patient.getEmail());
        response.setPhone(patient.getPhone());
        response.setAge(patient.getAge());
        response.setDob(patient.getDob());
        response.setGender(patient.getGender());
        response.setAddress(patient.getAddress());
        response.setUserId(patient.getUser() != null ? patient.getUser().getPatentId() : null);
        return response;
    }
}
