package com.example.dentalclinic.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.example.dentalclinic.Entity.User;
import com.example.dentalclinic.Service.UserService;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/username/{id}")
    public String getUsername(@PathVariable("id") Long id) {
        return userService.getUsernameById(id);
    }

    @GetMapping("/allusers")
    public List<User> allUser() {
        return userService.getAllUsers();
    }

}
