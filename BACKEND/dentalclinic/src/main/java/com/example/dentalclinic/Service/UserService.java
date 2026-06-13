package com.example.dentalclinic.Service;

import org.springframework.stereotype.Service;

import com.example.dentalclinic.Entity.User;
import com.example.dentalclinic.Repository.UserRepository;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;

@Service
public class UserService {

    @Autowired
    UserRepository userRepository;

    public String getUsernameById(Long id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            return userOpt.get().getUsername();
        }
        return "User not found";
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

}
