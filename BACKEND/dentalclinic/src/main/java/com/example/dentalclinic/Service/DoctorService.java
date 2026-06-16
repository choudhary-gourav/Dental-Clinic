package com.example.dentalclinic.Service;

import com.example.dentalclinic.Entity.Doctor;
import com.example.dentalclinic.Repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Service
public class DoctorService {

    @Autowired
    DoctorRepository doctorrepo;

    public Doctor savedoctor(Doctor doctor) {
        return doctorrepo.save(doctor);
    }

    public Doctor findDoctorById(Long id) {
        return doctorrepo.findById(id).orElseThrow(()-> new RuntimeException("doctor not found"));
    }

    public List<Doctor> getalldoctors(){
        return doctorrepo.findAll();
    }

    public void deleteDoctorById(Long id){
        if(!doctorrepo.existsById(id)){
            System.out.println("doctor not found");
        }
       doctorrepo.deleteById(id);
    }


}
