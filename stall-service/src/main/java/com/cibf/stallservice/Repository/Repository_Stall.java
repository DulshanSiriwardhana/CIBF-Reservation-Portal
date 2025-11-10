package com.cibf.stallservice.Repository;

import com.cibf.stallservice.Model.Model_Stall;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface Repository_Stall extends JpaRepository<Model_Stall, Long> {
    Optional<Model_Stall> findByName(String name);
    // Additional queries if needed
}
