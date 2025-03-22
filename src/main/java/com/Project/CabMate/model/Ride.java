package com.Project.CabMate.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter @Setter @NoArgsConstructor
public class Ride {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "car_id")
    private Car car;

    private String pickupLocation;
    private String dropoffLocation;
    private LocalDateTime departureTime;
    private double price;

    public Ride(Car car, String pickupLocation, String dropoffLocation, LocalDateTime departureTime, double price) {
        this.car = car;
        this.pickupLocation = pickupLocation;
        this.dropoffLocation = dropoffLocation;
        this.departureTime = departureTime;
        this.price = price;
    }
}
