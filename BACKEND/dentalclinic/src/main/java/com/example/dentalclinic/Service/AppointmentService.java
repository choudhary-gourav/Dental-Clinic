package com.example.dentalclinic.Service;

import com.example.dentalclinic.DTO.CreateAppointmentDto;
import com.example.dentalclinic.Entity.Appointment;
import com.example.dentalclinic.Entity.Doctor;
import com.example.dentalclinic.Entity.Patient;
import com.example.dentalclinic.Repository.AppointmentRepository;
import com.example.dentalclinic.Repository.DoctorRepository;
import com.example.dentalclinic.Repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentrepo;

    @Autowired
    private DoctorRepository doctorrepo;

    @Autowired
    private PatientRepository patientrepo;

    public Appointment bookAppointment(Appointment appointment) {
        return appointmentrepo.save(appointment);
    }

    public Appointment findById(long id) {
        return appointmentrepo.findById(id).orElseThrow(() -> new RuntimeException("appointment not found"));
    }

    public List<Appointment> appointment() {
        return appointmentrepo.findAll();
    }


    public List<String> getAvailableTimeSlots(String doctorId, String dateStr) {
        Doctor doctor = resolveDoctor(doctorId);
        LocalDate date = LocalDate.parse(dateStr);
        
        List<Appointment> bookedAppointments = appointmentrepo.findByDoctorIdAndDate(doctor.getDoctor_id(), date);
        
        List<String> defaultSlots = new java.util.ArrayList<>(List.of(
            "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
            "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM",
            "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
        ));
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("hh:mm a", Locale.ENGLISH);
        
        for (Appointment app : bookedAppointments) {
            if (app.getAppointmentTime() != null) {
                String formatted = app.getAppointmentTime().format(formatter).toUpperCase();
                defaultSlots.remove(formatted);
            }
        }
        
        return defaultSlots;
    }

    private Doctor resolveDoctor(String doctorId) {
        if (doctorId == null) {
            throw new IllegalArgumentException("Doctor ID cannot be null");
        }
        
        try {
            Long id = Long.parseLong(doctorId);
            return doctorrepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Doctor not found with ID: " + doctorId));
        } catch (NumberFormatException e) {
            throw new RuntimeException("Invalid doctor ID format: " + doctorId);
        }
    }

    public Appointment createFromDto(CreateAppointmentDto dto) {
        Doctor doctor = resolveDoctor(dto.getDoctorId());
        Patient patient = patientrepo.findByEmail(dto.getPatientEmail())
                .orElseThrow(() -> new RuntimeException("Patient profile not found. Please complete registration."));

        Appointment appointment = new Appointment();
        appointment.setDoctor(doctor);
        appointment.setPatient(patient);
        appointment.setAppointmentDate(LocalDate.parse(dto.getDate()));
        

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("hh:mm a", Locale.ENGLISH);
        appointment.setAppointmentTime(LocalTime.parse(dto.getTime(), formatter));
        

        String reason = dto.getServiceId();
        if (dto.getNotes() != null && !dto.getNotes().trim().isEmpty()) {
            reason += " - Notes: " + dto.getNotes().trim();
        }
        appointment.setReason(reason);
        appointment.setStatus("CONFIRMED");

        return appointmentrepo.save(appointment);
    }
}
