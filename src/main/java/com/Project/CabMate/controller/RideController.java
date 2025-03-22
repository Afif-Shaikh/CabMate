package com.Project.CabMate.controller;

import com.Project.CabMate.model.Ride;
import com.Project.CabMate.repository.RideRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rides")
@CrossOrigin(origins = "*")
public class RideController {

    @Autowired
    private RideRepository rideRepository;

    @PostMapping("/add")
    public ResponseEntity<Ride> addRide(@RequestBody Ride ride) {
        return ResponseEntity.ok(rideRepository.save(ride));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Ride>> searchRides(@RequestParam String pickup, @RequestParam String dropoff) {
        return ResponseEntity.ok(rideRepository.findByPickupLocationAndDropoffLocation(pickup, dropoff));
    }
}
