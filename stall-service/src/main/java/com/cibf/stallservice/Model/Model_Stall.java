package com.cibf.stallservice.Model;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
public class Model_Stall {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long stallId;

    @Column(nullable=false, unique=true)
    private String stallName;

    @Column(nullable=false)
    private String size;

    @Column(nullable=false)
    private boolean available = true;

    @Column
    private String locationDescription;

    // Getters and setters

    public Model_Stall() {}

    public Model_Stall(String name, String size, boolean available, String locationDescription) {
        this.stallName = name;
        this.size = size;
        this.available = available;
        this.locationDescription = locationDescription;
    }


    // Getter and setter for stallId
    public Long getStallId() {
        return stallId;
    }
    public void setStallId(Long stallId) {
        this.stallId = stallId;
    }

    // Getter and setter for stallName
    public String getStallName() {
        return stallName;
    }
    public void setStallName(String stallName) {
        this.stallName = stallName;
    }

    // Getter and setter for size
    public String getSize() {
        return size;
    }
    public void setSize(String size) {
        this.size = size;
    }

    // Getter and setter for available
    public boolean isAvailable() {
        return available;
    }
    public void setAvailable(boolean available) {
        this.available = available;
    }

    // Getter and setter for locationDescription
    public String getLocationDescription() {
        return locationDescription;
    }
    public void setLocationDescription(String locationDescription) {
        this.locationDescription = locationDescription;
    }
}
