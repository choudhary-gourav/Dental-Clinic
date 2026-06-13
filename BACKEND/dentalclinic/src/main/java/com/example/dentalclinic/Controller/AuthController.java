package com.example.dentalclinic.Controller;

import com.example.dentalclinic.DTO.AuthResponse;
import com.example.dentalclinic.DTO.LoginRequest;
import com.example.dentalclinic.DTO.SignupRequest;
import com.example.dentalclinic.Service.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    AuthenticationService authservice;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        return ResponseEntity.ok(
                new AuthResponse(
                        authservice.Signup(request)
                )
        );
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(
                new AuthResponse(
                        authservice.Login(request)
                )
        );
    }


}
