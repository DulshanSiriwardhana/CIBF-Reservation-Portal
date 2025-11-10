package com.bookfair.user_service.dto;

import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {
    
    private String email;
    
    private String businessName;
    
    @Pattern(regexp = "^[0-9]{10}$", message = "Contact number must be 10 digits")
    private String contactNumber;
}