package com.example.dentalclinic.Repository;

import com.example.dentalclinic.Entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient,Long> {
    @Query("select p from Patient p where p.email = :email")
    Optional<Patient> findByEmail(@Param("email") String email);

    @Query("select count(p) > 0 from Patient p where p.email = :email")
    boolean existsByEmail(@Param("email") String email);

    @Query("select p from Patient p where p.user.patentId = :userId")
    Optional<Patient> findByUserId(@Param("userId") Long userId);

    @Query("select count(p) > 0 from Patient p where p.user.patentId = :userId")
    boolean existsByUserId(@Param("userId") Long userId);
}
