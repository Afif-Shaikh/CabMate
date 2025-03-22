package com.Project.CabMate.repository;

import com.Project.CabMate.model.Ride;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RideRepository extends JpaRepository<Ride, Long> {
    List<Ride> findByPickupLocationAndDropoffLocation(String pickupLocation, String dropoffLocation);
}
