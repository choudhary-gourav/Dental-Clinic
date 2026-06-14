package com.example.dentalclinic.Repository;

import com.example.dentalclinic.Entity.Patient;
import org.hibernate.sql.ast.tree.expression.JdbcParameter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient,Long> {
    Optional<Patient> findByEmail(String email);
    boolean existsByEmail(String email);
}
