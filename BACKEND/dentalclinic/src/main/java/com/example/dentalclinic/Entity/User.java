package com.example.dentalclinic.Entity;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "users")
public class User {

    @Column(name = "Username")
    private String username;

    @Column(name = "PasswordHash")
    private String passwordHash;

    @Column(name = "Email")
    private String email;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PatentId")
    private Long patentId;


}
