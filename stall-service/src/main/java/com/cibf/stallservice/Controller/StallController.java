package com.cibf.stallservice.controller;

import com.cibf.stallservice.dto.*;
import com.cibf.stallservice.model.StallModel;
import com.cibf.stallservice.service.StallService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stalls")
@RequiredArgsConstructor
//@Slf4j
@CrossOrigin(originPatterns = "*", allowCredentials = "true")
@Tag(name = "Stall Management", description = "APIs for managing exhibition stalls")
public class StallController {
    private static final Logger log = LoggerFactory.getLogger(StallController.class);
    private final StallService stallService;

    @PostMapping
    @Operation(summary = "Create a new stall")
    public ResponseEntity<ApiResponse<StallResponseDTO>> createStall(
            @Valid @RequestBody StallRequestDTO requestDTO) {
        log.info("POST /api/stalls - Creating new stall: {}", requestDTO.getStallName());
        StallResponseDTO response = stallService.createStall(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Stall created successfully", response));
    }

    @GetMapping
    @Operation(summary = "Get all stalls")
    public ResponseEntity<ApiResponse<List<StallResponseDTO>>> getAllStalls() {
        log.info("GET /api/stalls - Fetching all stalls");
        List<StallResponseDTO> stalls = stallService.getAllStalls();
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Stalls retrieved successfully", stalls));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get stall by ID")
    public ResponseEntity<ApiResponse<StallResponseDTO>> getStallById(@PathVariable Long id) {
        log.info("GET /api/stalls/{} - Fetching stall by ID", id);
        StallResponseDTO stall = stallService.getStallById(id);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Stall retrieved successfully", stall));
    }

    @GetMapping("/name/{stallName}")
    @Operation(summary = "Get stall by name")
    public ResponseEntity<ApiResponse<StallResponseDTO>> getStallByName(
            @PathVariable String stallName) {
        log.info("GET /api/stalls/name/{} - Fetching stall by name", stallName);
        StallResponseDTO stall = stallService.getStallByName(stallName);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Stall retrieved successfully", stall));
    }

    @GetMapping("/available")
    @Operation(summary = "Get all available stalls")
    public ResponseEntity<ApiResponse<List<StallResponseDTO>>> getAvailableStalls() {
        log.info("GET /api/stalls/available - Fetching available stalls");
        List<StallResponseDTO> stalls = stallService.getAvailableStalls();
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Available stalls retrieved successfully", stalls));
    }

    @GetMapping("/size/{size}")
    @Operation(summary = "Get stalls by size")
    public ResponseEntity<ApiResponse<List<StallResponseDTO>>> getStallsBySize(
            @PathVariable StallModel.StallSize size) {
        log.info("GET /api/stalls/size/{} - Fetching stalls by size", size);
        List<StallResponseDTO> stalls = stallService.getStallsBySize(size);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Stalls retrieved successfully", stalls));
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get stalls by status")
    public ResponseEntity<ApiResponse<List<StallResponseDTO>>> getStallsByStatus(
            @PathVariable StallModel.StallStatus status) {
        log.info("GET /api/stalls/status/{} - Fetching stalls by status", status);
        List<StallResponseDTO> stalls = stallService.getStallsByStatus(status);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Stalls retrieved successfully", stalls));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get stalls reserved by user")
    public ResponseEntity<ApiResponse<List<StallResponseDTO>>> getStallsByUser(
            @PathVariable Long userId) {
        log.info("GET /api/stalls/user/{} - Fetching stalls for user", userId);
        List<StallResponseDTO> stalls = stallService.getStallsByUser(userId);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "User stalls retrieved successfully", stalls));
    }

    @GetMapping("/price-range")
    @Operation(summary = "Get stalls by price range")
    public ResponseEntity<ApiResponse<List<StallResponseDTO>>> getStallsByPriceRange(
            @RequestParam Double minPrice, @RequestParam Double maxPrice) {
        log.info("GET /api/stalls/price-range?minPrice={}&maxPrice={}", minPrice, maxPrice);
        List<StallResponseDTO> stalls = stallService.getStallsByPriceRange(minPrice, maxPrice);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Stalls retrieved successfully", stalls));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update stall")
    public ResponseEntity<ApiResponse<StallResponseDTO>> updateStall(
            @PathVariable Long id,
            @Valid @RequestBody StallUpdateDTO updateDTO) {
        log.info("PUT /api/stalls/{} - Updating stall", id);
        StallResponseDTO response = stallService.updateStall(id, updateDTO);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Stall updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete stall")
    public ResponseEntity<ApiResponse<Void>> deleteStall(@PathVariable Long id) {
        log.info("DELETE /api/stalls/{} - Deleting stall", id);
        stallService.deleteStall(id);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Stall deleted successfully", null));
    }

    @PostMapping("/{stallId}/reserve")
    @Operation(summary = "Reserve a stall")
    public ResponseEntity<ApiResponse<StallResponseDTO>> reserveStall(
            @PathVariable Long stallId,
            @RequestParam Long userId,
            @RequestParam Long reservationId) {
        log.info("POST /api/stalls/{}/reserve - Reserving stall for user {}", stallId, userId);
        StallResponseDTO response = stallService.reserveStall(stallId, userId, reservationId);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Stall reserved successfully", response));
    }

    @PostMapping("/{stallId}/release")
    @Operation(summary = "Release a stall")
    public ResponseEntity<ApiResponse<StallResponseDTO>> releaseStall(@PathVariable Long stallId) {
        log.info("POST /api/stalls/{}/release - Releasing stall", stallId);
        StallResponseDTO response = stallService.releaseStall(stallId);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Stall released successfully", response));
    }

    @GetMapping("/{stallId}/availability")
    @Operation(summary = "Check stall availability")
    public ResponseEntity<ApiResponse<StallAvailabilityDTO>> checkStallAvailability(
            @PathVariable Long stallId) {
        log.info("GET /api/stalls/{}/availability - Checking stall availability", stallId);
        StallAvailabilityDTO availability = stallService.checkStallAvailability(stallId);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Availability checked successfully", availability));
    }

    @GetMapping("/user/{userId}/can-reserve")
    @Operation(summary = "Check if user can reserve more stalls")
    public ResponseEntity<ApiResponse<Map<String, Object>>> canUserReserveMoreStalls(
            @PathVariable Long userId) {
        log.info("GET /api/stalls/user/{}/can-reserve - Checking user reservation limit", userId);
        boolean canReserve = stallService.canUserReserveMoreStalls(userId);
        Map<String, Object> response = new HashMap<>();
        response.put("canReserve", canReserve);
        response.put("userId", userId);
        response.put("maxStallsAllowed", 3);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "User reservation limit checked", response));
    }
}