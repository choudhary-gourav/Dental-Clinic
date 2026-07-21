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

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getPatentId() {
        return patentId;
    }

    public void setPatentId(Long patentId) {
        this.patentId = patentId;
    }
}
