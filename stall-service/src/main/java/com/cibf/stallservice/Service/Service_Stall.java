package com.cibf.stallservice.Service;

import com.cibf.stallservice.Model.Model_Stall;
import com.cibf.stallservice.Repository.Repository_Stall;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class Service_Stall {
    @Autowired
    private Repository_Stall stallRepository;

    public List<Model_Stall> getAllStalls() {
        return stallRepository.findAll();
    }

    public Optional<Model_Stall> getStallById(Long id) {
        return stallRepository.findById(id);
    }

    public Optional<Model_Stall> getStallByName(String name) {
        return stallRepository.findByName(name);
    }

    public Model_Stall createStall(Model_Stall stall) {
        return stallRepository.save(stall);
    }

    public Model_Stall updateStall(Long id, Model_Stall stallDetails) {
        Model_Stall stall = stallRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stall not found"));
        stall.setStallName(stallDetails.getStallName());
        stall.setSize(stallDetails.getSize());
        stall.setAvailable(stallDetails.isAvailable());
        stall.setLocationDescription(stallDetails.getLocationDescription());
        return stallRepository.save(stall);
    }

    public void deleteStall(Long id) {
        stallRepository.deleteById(id);
    }
}
