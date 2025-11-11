package com.cibf.stallservice.service;

import com.cibf.stallservice.model.StallModel;
import com.cibf.stallservice.dto.StallAvailabilityDTO;
import com.cibf.stallservice.dto.StallRequestDTO;
import com.cibf.stallservice.dto.StallResponseDTO;
import com.cibf.stallservice.dto.StallUpdateDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface StallService {

    StallResponseDTO createStall(StallRequestDTO requestDTO);
    StallResponseDTO getStallById(Long id);
    StallResponseDTO getStallByName(String stallName);
    List<StallResponseDTO> getAllStalls();
    List<StallResponseDTO> getAvailableStalls();
    List<StallResponseDTO> getStallsBySize(StallModel.StallSize size);
    List<StallResponseDTO> getStallsByStatus(StallModel.StallStatus status);
    List<StallResponseDTO> getStallsByUser(Long userId);
    StallResponseDTO updateStall(Long id, StallUpdateDTO updateDTO);
    void deleteStall(Long id);
    StallResponseDTO reserveStall(Long stallId, Long userId, Long reservationId);
    StallResponseDTO releaseStall(Long stallId);
    StallAvailabilityDTO checkStallAvailability(Long stallId);
    boolean canUserReserveMoreStalls(Long userId);
    List<StallResponseDTO> getStallsByPriceRange(Double minPrice, Double maxPrice);

}
