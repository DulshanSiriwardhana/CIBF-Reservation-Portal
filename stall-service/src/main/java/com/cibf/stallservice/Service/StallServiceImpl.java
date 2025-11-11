package com.cibf.stallservice.service;

import com.cibf.stallservice.model.StallModel;
import com.cibf.stallservice.dto.StallAvailabilityDTO;
import com.cibf.stallservice.dto.StallRequestDTO;
import com.cibf.stallservice.dto.StallResponseDTO;
import com.cibf.stallservice.dto.StallUpdateDTO;
import com.cibf.stallservice.event.StallEventPublisher;
import com.cibf.stallservice.event.StallReleasedEvent;
import com.cibf.stallservice.event.StallReservedEvent;
import com.cibf.stallservice.exceptions.ResourceNotFoundException;
import com.cibf.stallservice.exceptions.StallAlreadyExistsException;
import com.cibf.stallservice.exceptions.StallReservationException;
import com.cibf.stallservice.repository.StallRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class StallServiceImpl implements StallService {

    private final StallRepository stallRepository;
    private final StallEventPublisher eventPublisher;
    private static final int MAX_STALLS_PER_USER = 3;

    @Override
    public StallResponseDTO createStall(StallRequestDTO requestDTO) {
        log.info("Creating new stall: {}", requestDTO.getStallName());

        if (stallRepository.existsByStallName(requestDTO.getStallName())) {
            throw new StallAlreadyExistsException("Stall with name " +
                    requestDTO.getStallName() + " already exists");
        }

        StallModel stall = new StallModel();
        stall.setStallName(requestDTO.getStallName());
        stall.setSize(requestDTO.getSize());
        stall.setDimension(requestDTO.getDimension());
        stall.setPrice(requestDTO.getPrice());
        stall.setPositionX(requestDTO.getPositionX());
        stall.setPositionY(requestDTO.getPositionY());
        stall.setDescription(requestDTO.getDescription());
        stall.setStatus(StallModel.StallStatus.AVAILABLE);

        StallModel savedStall = stallRepository.save(stall);
        log.info("Stall created successfully with ID: {}", savedStall.getId());

        return mapToResponseDTO(savedStall);
    }

    @Override
    @Transactional(readOnly = true)
    public StallResponseDTO getStallById(Long id) {
        log.info("Fetching stall by ID: {}", id);
        StallModel stall = stallRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Stall not found with ID: " + id));
        return mapToResponseDTO(stall);
    }

    @Override
    @Transactional(readOnly = true)
    public StallResponseDTO getStallByName(String stallName) {
        log.info("Fetching stall by name: {}", stallName);
        StallModel stall = stallRepository.findByStallName(stallName)
                .orElseThrow(() -> new ResourceNotFoundException("Stall not found with name: " + stallName));
        return mapToResponseDTO(stall);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StallResponseDTO> getAllStalls() {
        log.info("Fetching all stalls");
        return stallRepository.findAll().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<StallResponseDTO> getAvailableStalls() {
        log.info("Fetching available stalls");
        return stallRepository.findAllAvailableStalls().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<StallResponseDTO> getStallsBySize(StallModel.StallSize size) {
        log.info("Fetching stalls by size: {}", size);
        return stallRepository.findBySize(size).stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<StallResponseDTO> getStallsByStatus(StallModel.StallStatus status) {
        log.info("Fetching stalls by status: {}", status);
        return stallRepository.findByStatus(status).stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<StallResponseDTO> getStallsByUser(Long userId) {
        log.info("Fetching stalls reserved by user: {}", userId);
        return stallRepository.findByReservedBy(userId).stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public StallResponseDTO updateStall(Long id, StallUpdateDTO updateDTO) {
        log.info("Updating stall with ID: {}", id);

        StallModel stall = stallRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Stall not found with ID: " + id));

        if (updateDTO.getStallName() != null &&
                !updateDTO.getStallName().equals(stall.getStallName())) {
            if (stallRepository.existsByStallName(updateDTO.getStallName())) {
                throw new StallAlreadyExistsException("Stall with name " +
                        updateDTO.getStallName() + " already exists");
            }
            stall.setStallName(updateDTO.getStallName());
        }

        if (updateDTO.getSize() != null) stall.setSize(updateDTO.getSize());
        if (updateDTO.getDimension() != null) stall.setDimension(updateDTO.getDimension());
        if (updateDTO.getPrice() != null) stall.setPrice(updateDTO.getPrice());
        if (updateDTO.getStatus() != null) stall.setStatus(updateDTO.getStatus());
        if (updateDTO.getPositionX() != null) stall.setPositionX(updateDTO.getPositionX());
        if (updateDTO.getPositionY() != null) stall.setPositionY(updateDTO.getPositionY());
        if (updateDTO.getDescription() != null) stall.setDescription(updateDTO.getDescription());

        StallModel updatedStall = stallRepository.save(stall);
        log.info("Stall updated successfully with ID: {}", id);

        return mapToResponseDTO(updatedStall);
    }

    @Override
    public void deleteStall(Long id) {
        log.info("Deleting stall with ID: {}", id);

        StallModel stall = stallRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Stall not found with ID: " + id));

        if (stall.getStatus() == StallModel.StallStatus.RESERVED) {
            throw new StallReservationException("Cannot delete a reserved stall. Please release it first.");
        }

        stallRepository.deleteById(id);
        log.info("Stall deleted successfully with ID: {}", id);
    }

    @Override
    public StallResponseDTO reserveStall(Long stallId, Long userId, Long reservationId) {
        log.info("Reserving stall {} for user {}", stallId, userId);

        StallModel stall = stallRepository.findById(stallId)
                .orElseThrow(() -> new ResourceNotFoundException("Stall not found with ID: " + stallId));

        if (stall.getStatus() != StallModel.StallStatus.AVAILABLE) {
            throw new StallReservationException("Stall is not available for reservation");
        }

        long userReservedCount = stallRepository.countReservedStallsByUser(userId);
        if (userReservedCount >= MAX_STALLS_PER_USER) {
            throw new StallReservationException("User has reached maximum stall reservation limit of " +
                    MAX_STALLS_PER_USER);
        }

        stall.setStatus(StallModel.StallStatus.RESERVED);
        stall.setReservedBy(userId);
        stall.setReservationId(reservationId);

        StallModel reservedStall = stallRepository.save(stall);
        log.info("Stall {} reserved successfully for user {}", stallId, userId);

        // Publish event
        StallReservedEvent event = StallReservedEvent.builder()
                .stallId(reservedStall.getId())
                .stallName(reservedStall.getStallName())
                .userId(userId)
                .reservationId(reservationId)
                .price(reservedStall.getPrice())
                .reservedAt(LocalDateTime.now())
                .build();
        eventPublisher.publishStallReservedEvent(event);

        return mapToResponseDTO(reservedStall);
    }

    @Override
    public StallResponseDTO releaseStall(Long stallId) {
        log.info("Releasing stall: {}", stallId);

        StallModel stall = stallRepository.findById(stallId)
                .orElseThrow(() -> new ResourceNotFoundException("Stall not found with ID: " + stallId));

        if (stall.getStatus() != StallModel.StallStatus.RESERVED) {
            throw new StallReservationException("Stall is not currently reserved");
        }

        Long previousUserId = stall.getReservedBy();
        String stallName = stall.getStallName();

        stall.setStatus(StallModel.StallStatus.AVAILABLE);
        stall.setReservedBy(null);
        stall.setReservationId(null);

        StallModel releasedStall = stallRepository.save(stall);
        log.info("Stall {} released successfully", stallId);

        // Publish event
        StallReleasedEvent event = StallReleasedEvent.builder()
                .stallId(stallId)
                .stallName(stallName)
                .userId(previousUserId)
                .releasedAt(LocalDateTime.now())
                .build();
        eventPublisher.publishStallReleasedEvent(event);

        return mapToResponseDTO(releasedStall);
    }

    @Override
    @Transactional(readOnly = true)
    public StallAvailabilityDTO checkStallAvailability(Long stallId) {
        log.info("Checking availability for stall: {}", stallId);

        StallModel stall = stallRepository.findById(stallId)
                .orElseThrow(() -> new ResourceNotFoundException("Stall not found with ID: " + stallId));

        boolean isAvailable = stall.getStatus() == StallModel.StallStatus.AVAILABLE;
        String message = isAvailable ? "Stall is available" :
                "Stall is " + stall.getStatus().name().toLowerCase();

        return StallAvailabilityDTO.builder()
                .stallId(stallId)
                .stallName(stall.getStallName())
                .isAvailable(isAvailable)
                .message(message)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public boolean canUserReserveMoreStalls(Long userId) {
        long count = stallRepository.countReservedStallsByUser(userId);
        return count < MAX_STALLS_PER_USER;
    }

    @Override
    @Transactional(readOnly = true)
    public List<StallResponseDTO> getStallsByPriceRange(Double minPrice, Double maxPrice) {
        log.info("Fetching stalls in price range: {} - {}", minPrice, maxPrice);
        return stallRepository.findStallsByPriceRange(minPrice, maxPrice).stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    private StallResponseDTO mapToResponseDTO(StallModel stall) {
        return StallResponseDTO.builder()
                .id(stall.getId())
                .stallName(stall.getStallName())
                .size(stall.getSize())
                .dimension(stall.getDimension())
                .price(stall.getPrice())
                .status(stall.getStatus())
                .positionX(stall.getPositionX())
                .positionY(stall.getPositionY())
                .description(stall.getDescription())
                .reservedBy(stall.getReservedBy())
                .reservationId(stall.getReservationId())
                .createdAt(stall.getCreatedAt())
                .updatedAt(stall.getUpdatedAt())
                .build();
    }
}
