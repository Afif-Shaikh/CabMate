package com.Project.CabMate.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter @NoArgsConstructor
public class Car {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String ownerName;
    private String model;
    private String licensePlate;
    private int seats;
    private String status;

    public Car(String ownerName, String model, String licensePlate, int seats, String status) {
        this.ownerName = ownerName;
        this.model = model;
        this.licensePlate = licensePlate;
        this.seats = seats;
        this.status = status;
    }
}

