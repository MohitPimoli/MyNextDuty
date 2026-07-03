package com.mynextduty.core.dto.user;

import com.mynextduty.core.enums.LifeStage;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserProfileUpdateRequestDto {

    @NotBlank(message = "First name is required")
    @Size(max = 50, message = "First name must not exceed 50 characters")
    private String firstName;

    @Size(max = 50, message = "Last name must not exceed 50 characters")
    private String lastName;

    private LocalDate dateOfBirth;

    private LifeStage lifeStage;

    @Size(max = 100, message = "Occupation must not exceed 100 characters")
    private String currentOccupation;

    private String educationLevelCode;

    @Min(value = 0, message = "Monthly income must be non-negative")
    private Double monthlyIncome;
}
