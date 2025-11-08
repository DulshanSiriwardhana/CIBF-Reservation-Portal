package com.cibf.stallservice.Service;

import com.cibf.stallservice.Model.Model_Stall;
import com.cibf.stallservice.Repository.Repository_Stall;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class Service_Stall {
    private final Repository_Stall repository;

    public Service_Stall(Repository_Stall repository) {
        this.repository = repository;
    }

    public Model_Stall createReservation(Model_Stall reservation) {
        return repository.save(reservation);
    }

    public List<Model_Stall> getReservations() {
        return repository.findAll();
    }
}
