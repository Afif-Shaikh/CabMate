package com.Project.CabMate.controller;

import com.Project.CabMate.model.Booking;
import com.Project.CabMate.model.BookingStatus;
import com.Project.CabMate.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @PostMapping("/request")
    public ResponseEntity<Booking> requestBooking(@RequestBody Booking booking) {
        booking.setStatus(BookingStatus.PENDING);
        return ResponseEntity.ok(bookingRepository.save(booking));
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<Booking> approveBooking(@PathVariable Long id) {
        Booking booking = bookingRepository.findById(id).orElseThrow();
        booking.setStatus(BookingStatus.CONFIRMED);
        return ResponseEntity.ok(bookingRepository.save(booking));
    }

    @PutMapping("/cancel/{id}")
    public ResponseEntity<Booking> cancelBooking(@PathVariable Long id) {
        Booking booking = bookingRepository.findById(id).orElseThrow();
        booking.setStatus(BookingStatus.CANCELLED);
        return ResponseEntity.ok(bookingRepository.save(booking));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingRepository.findAll());
    }
}
