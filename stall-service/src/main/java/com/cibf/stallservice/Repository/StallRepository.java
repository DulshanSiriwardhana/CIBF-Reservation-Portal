package com.cibf.stallservice.repository;

import com.cibf.stallservice.model.StallModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StallRepository extends JpaRepository<StallModel, Long> {
    // Find StallModel by id
    Optional<StallModel> findById(Long id);
    // Find StallModel by name
    Optional<StallModel> findByStallName(String stallName);

    // Find stalls by status
    List<StallModel> findByStatus(StallModel.StallStatus status);

    // Find stalls by size
    List<StallModel> findBySize(StallModel.StallSize size);

    // Find stalls by size and status
    List<StallModel> findBySizeAndStatus(StallModel.StallSize size, StallModel.StallStatus status);

    // Find stalls reserved by a specific user
    List<StallModel> findByReservedBy(Long userId);

    // Count stalls reserved by a specific user
    @Query("SELECT COUNT(s) FROM StallModel s WHERE s.reservedBy = :userId AND s.status = 'RESERVED'")
    long countReservedStallsByUser(@Param("userId") Long userId);

    // Find available stalls
    @Query("SELECT s FROM StallModel s WHERE s.status = 'AVAILABLE' ORDER BY s.stallName")
    List<StallModel> findAllAvailableStalls();

    // Find stalls by price range
    @Query("SELECT s FROM StallModel s WHERE s.price BETWEEN :minPrice AND :maxPrice")
    List<StallModel> findStallsByPriceRange(@Param("minPrice") Double minPrice,
                                       @Param("maxPrice") Double maxPrice);

    // Find stalls by area (position range)
    @Query("SELECT s FROM StallModel s WHERE s.positionX BETWEEN :minX AND :maxX " +
            "AND s.positionY BETWEEN :minY AND :maxY")
    List<StallModel> findStallsByArea(@Param("minX") Integer minX,
                                 @Param("maxX") Integer maxX,
                                 @Param("minY") Integer minY,
                                 @Param("maxY") Integer maxY);

    // Check if StallModel name exists
    boolean existsByStallName(String stallName);

    // Find stalls by reservation ID
    List<StallModel> findByReservationId(Long reservationId);

    // Get stalls grouped by size with count
    @Query("SELECT s.size, COUNT(s) FROM StallModel s GROUP BY s.size")
    List<Object[]> countStallsBySize();

    // Get stalls grouped by status with count
    @Query("SELECT s.status, COUNT(s) FROM StallModel s GROUP BY s.status")
    List<Object[]> countStallsByStatus();
}
