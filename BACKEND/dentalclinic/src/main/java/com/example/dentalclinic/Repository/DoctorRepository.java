package com.example.dentalclinic.Repository;

import com.example.dentalclinic.Entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {

}
