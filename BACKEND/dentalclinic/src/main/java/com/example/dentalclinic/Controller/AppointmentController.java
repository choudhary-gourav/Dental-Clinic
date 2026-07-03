package com.example.dentalclinic.Controller;

import com.example.dentalclinic.DTO.CreateAppointmentDto;
import com.example.dentalclinic.Entity.Appointment;
import com.example.dentalclinic.Service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/appointments")
@CrossOrigin(origins = "*")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @PostMapping
    public ResponseEntity<Appointment> createAppointment(@RequestBody CreateAppointmentDto dto) {
        Appointment appointment = appointmentService.createFromDto(dto);
        return ResponseEntity.ok(appointment);
    }

    @GetMapping("/available-slots")
    public ResponseEntity<List<String>> getAvailableSlots(
            @RequestParam String doctorId,
            @RequestParam String date) {
        List<String> slots = appointmentService.getAvailableTimeSlots(doctorId, date);
        return ResponseEntity.ok(slots);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.appointment());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.findById(id));
    }
}
