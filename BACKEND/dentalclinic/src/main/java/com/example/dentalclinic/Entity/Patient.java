package com.example.dentalclinic.Entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "patients")
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String Username;
    private String Email;
    private String Phone;
    private String DOB;
    private String Gender;
    private String Address;

    @OneToOne
    @JoinColumn(name ="PatentId")
    User user;




    public Patient(String username, String email, String DOB, String address, String gender, String phone) {
        Username = username;
        Email = email;
        this.DOB = DOB;
        Address = address;

        Gender = gender;
        Phone = phone;
    }

    public Patient() {
    }
}
