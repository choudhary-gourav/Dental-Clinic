package com.example.dentalclinic.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "patients")
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long patient_id;

    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private Integer age;
    private LocalDate dob;
    private String gender;
    private String address;

    @OneToOne
    @JoinColumn(name ="PatentId")
    User user;




}
