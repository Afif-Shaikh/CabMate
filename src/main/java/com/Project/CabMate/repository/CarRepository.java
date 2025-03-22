package com.Project.CabMate.repository;

import com.Project.CabMate.model.Car;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CarRepository extends JpaRepository<Car, Long> {
}
