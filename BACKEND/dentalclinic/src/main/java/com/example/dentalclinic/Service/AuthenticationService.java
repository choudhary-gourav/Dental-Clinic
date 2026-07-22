package com.example.dentalclinic.Service;

import com.example.dentalclinic.DTO.LoginRequest;
import com.example.dentalclinic.DTO.SignupRequest;

import com.example.dentalclinic.Entity.Admin;
import com.example.dentalclinic.Entity.User;
import com.example.dentalclinic.Repository.AdminRepository;
import com.example.dentalclinic.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    @Autowired
    UserRepository userrepo;

    @Autowired
    private BCryptPasswordEncoder PasswordEncoder;

    @Autowired
    private AdminRepository adminrepo;

    public String Signup(SignupRequest request) {

        if (userrepo.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        User user = new User();
        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());

        user.setPasswordHash(PasswordEncoder.encode(request.getPasswordHash()));

        userrepo.save(user);
        return "User Registered Successfully";

    }

    public String Login(LoginRequest request) {
        User user = userrepo.findByEmail(request.getEmail()).orElseThrow(() -> new RuntimeException("Email not found"));
        if (!PasswordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Password Mismatch");
        }
        return "User Logged Successfully";
    }

    public String adminLogin(LoginRequest request) {
        Admin admin = adminrepo.findByEmail(request.getEmail()).orElseThrow(() -> new RuntimeException("Email not found"));
        if (!PasswordEncoder.matches(request.getPassword(), admin.getPassword())) {
            throw new RuntimeException("Password Mismatch");
        }
        return "Admin Logged Successfully";
    }

    public String googleLogin(String idToken) {
        String googleUrl = "https://oauth2.googleapis.com/tokeninfo?id_token=" + idToken;
        org.springframework.web.client.RestTemplate restTemplate = new org.springframework.web.client.RestTemplate();
        try {
            java.util.Map<?, ?> response = restTemplate.getForObject(googleUrl, java.util.Map.class);
            if (response == null || response.get("error") != null) {
                throw new RuntimeException("Invalid Google Token");
            }
            
            String email = (String) response.get("email");
            String name = (String) response.get("name");
            
            if (email == null) {
                throw new RuntimeException("Email not found in Google Token");
            }
            
            if (!userrepo.existsByEmail(email)) {
                User user = new User();
                user.setEmail(email);
                user.setUsername(name != null ? name : email.split("@")[0]);
                user.setPasswordHash(PasswordEncoder.encode(java.util.UUID.randomUUID().toString()));
                userrepo.save(user);
            }
            
            return "User Logged Successfully";
        } catch (Exception e) {
            throw new RuntimeException("Google Sign-In failed: " + e.getMessage());
        }
    }
}
