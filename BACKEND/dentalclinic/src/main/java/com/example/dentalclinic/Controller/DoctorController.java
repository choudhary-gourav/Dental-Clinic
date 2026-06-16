package com.example.dentalclinic.Controller;

import com.example.dentalclinic.Entity.Doctor;
import com.example.dentalclinic.Repository.DoctorRepository;
import com.example.dentalclinic.Service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/doctor")
public class DoctorController {

    @Autowired
    DoctorRepository doctorrepo;

    @Autowired
    DoctorService doctorservice;

    @PostMapping("/savedoctor")
    public Doctor saveDoctor(@RequestBody Doctor doctor){
        return doctorservice.savedoctor(doctor);
    }

    @GetMapping("/{id}")
    public Doctor getDoctorById(@PathVariable("id") long id){
        return doctorservice.findDoctorById(id);
    }

    @GetMapping("/alldoctor")
    public List<Doctor> getAllDoctor(){
        return doctorservice.getalldoctors();
    }

    @DeleteMapping("/delete/{id}")
    public void deleteDoctorById(@PathVariable("id") long id){
        doctorservice.deleteDoctorById(id);
    }
}
