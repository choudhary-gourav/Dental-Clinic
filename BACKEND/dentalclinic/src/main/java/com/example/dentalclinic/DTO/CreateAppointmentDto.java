package com.example.dentalclinic.DTO;

import lombok.Data;

@Data
public class CreateAppointmentDto {
    private String serviceId;
    private String doctorId;
    private String date;
    private String time;
    private String patientName;
    private String patientEmail;
    private String patientPhone;
    private String notes;
}
