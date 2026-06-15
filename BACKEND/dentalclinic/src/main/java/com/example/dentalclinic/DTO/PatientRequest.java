package com.example.dentalclinic.DTO;


import lombok.Data;

import java.time.LocalDate;

@Data
public class PatientRequest {


    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private Integer age;
    private LocalDate dob;
    private String gender;
    private String address;
}
