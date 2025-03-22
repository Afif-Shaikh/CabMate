package com.Project.CabMate.config;

import com.Project.CabMate.model.Car;
import com.Project.CabMate.model.Ride;
import com.Project.CabMate.repository.CarRepository;
import com.Project.CabMate.repository.RideRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {
    private final CarRepository carRepository;
    private final RideRepository rideRepository;

    public DataLoader(CarRepository carRepository, RideRepository rideRepository) {
        this.carRepository = carRepository;
        this.rideRepository = rideRepository;
    }

    @Override
    public void run(String... args) {
        if (carRepository.count() == 0) {
            Car car1 = new Car("John Doe", "Toyota Camry", "ABC-1234", 4, "Available");
            Car car2 = new Car("Jane Smith", "Honda Civic", "XYZ-5678", 3, "Available");

            carRepository.saveAll(List.of(car1, car2));

            Ride ride1 = new Ride(car1, "Downtown", "Airport", LocalDateTime.now().plusHours(2), 15.00);
            Ride ride2 = new Ride(car2, "Mall", "Stadium", LocalDateTime.now().plusHours(1), 10.00);

            rideRepository.saveAll(List.of(ride1, ride2));
        }
    }
}
