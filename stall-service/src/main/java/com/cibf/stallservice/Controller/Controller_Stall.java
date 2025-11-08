package com.cibf.stallservice.Controller;

import com.cibf.stallservice.Model.Model_Stall;
import com.cibf.stallservice.Service.Service_Stall;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/stalls")
public class Controller_Stall {
    private final Service_Stall service;

    public Controller_Stall(Service_Stall service) {
        this.service = service;
    }

    @PostMapping("/reserve")
    public Model_Stall reserve(@RequestBody Model_Stall reservation) {
        return service.createReservation(reservation);
    }

    @GetMapping
    public List<Model_Stall> listReservations() {
        return service.getReservations();
    }
}
