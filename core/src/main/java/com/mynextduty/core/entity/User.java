package com.mynextduty.core.entity;

import com.mynextduty.core.enums.LifeStage;
import com.mynextduty.core.converter.LifeStageConverter;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(unique = true, nullable = false)
  private String email;

  @Column(nullable = false, name = "password_hash")
  private String passwordHash;

  @Column(nullable = false)
  private String firstName;

  private String lastName;

  private int age;

  @Column(name = "current_occupation")
  private String currentOccupation;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "education_level_id")
  private EducationLevel educationLevel;

  private LocalDate dateOfBirth;

  @Column(nullable = false,name = "is_verified")
  @Builder.Default
  private boolean isVerified = false;

  @Convert(converter = LifeStageConverter.class)
  @Column(name = "life_stage", columnDefinition = "VARCHAR(50)")
  private LifeStage lifeStage;

  private Double monthlyIncome;

  // One-to-Many relationships
  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<UserInterest> userInterests;

  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<UserDutyProgress> dutyProgress;

  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<UserGoal> userGoals;

  @Builder.Default
  @Column(nullable = false, name = "created_at")
  private LocalDateTime createdAt = LocalDateTime.now();

  @Column(name = "updated_at")
  private LocalDateTime updatedAt;

  private LocalDateTime lastAccessTime;

  @OneToOne(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
  private UserLocation userLocation;

  @ManyToOne
  @JoinColumn(name = "role_id")
  private Role role;

  @PreUpdate
  public void preUpdate() {
    this.updatedAt = LocalDateTime.now();
  }
}
