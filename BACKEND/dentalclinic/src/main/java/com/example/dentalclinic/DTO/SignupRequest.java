package com.example.dentalclinic.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignupRequest {
    private String Username;
    private String PasswordHash;
    private String Email;
}
