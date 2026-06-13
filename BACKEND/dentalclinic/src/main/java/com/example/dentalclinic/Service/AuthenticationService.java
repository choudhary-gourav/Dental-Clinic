package com.example.dentalclinic.Service;

import com.example.dentalclinic.DTO.LoginRequest;
import com.example.dentalclinic.DTO.SignupRequest;

import com.example.dentalclinic.Entity.User;
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
            User user = userrepo.findByEmail(request.getEmail()).orElseThrow(()->new RuntimeException("Email not found"));
            if(!PasswordEncoder.matches(request.getPassword(), user.getPasswordHash())){
                throw new RuntimeException("Password Mismatch");
            }
            return "User Logged Successfully";
    }
}
