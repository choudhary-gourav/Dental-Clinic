package com.example.dentalclinic.Entity;

import jakarta.persistence.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {

    @Column(name = "Username")
    private String Username;

    @Column(name = "PasswordHash")
    private String PasswordHash;

    @Column(name = "Email")
    private String Email;

    @Id
    @Column(name = "PatentId")
    private Long PatentId;

    public String getUsername() {
        return Username;
    }

    public void setUsername(String username) {
        Username = username;
    }

    public String getPasswordHash() {
        return PasswordHash;
    }

    public void setPasswordHash(String passwordHash) {
        PasswordHash = passwordHash;
    }

    public String getEmail() {
        return Email;
    }

    public void setEmail(String email) {
        Email = email;
    }

    public Long getPatentId() {
        return PatentId;
    }

    public void setPatentId(Long patentId) {
        PatentId = patentId;
    }

    public User(String username, String passwordHash, String email, Long patentId) {
        Username = username;
        PasswordHash = passwordHash;
        Email = email;
        PatentId = patentId;
    }

    public User() {
    }
}
