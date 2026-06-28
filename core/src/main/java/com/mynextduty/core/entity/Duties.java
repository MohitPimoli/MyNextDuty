package com.mynextduty.core.entity;

import com.mynextduty.core.enums.LifeStage;
import com.mynextduty.core.enums.Priority;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "duties")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Duties {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String title;

  @Column(length = 1000)
  private String description;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "category_id", nullable = false)
  private Category category;

  @Column(columnDefinition = "VARCHAR(50)")
  private Priority priority;

  @Column(name = "target_life_stage", columnDefinition = "VARCHAR(50)")
  private LifeStage targetLifeStage;

  private Integer minAge;
  private Integer maxAge;

  private Double estimatedCost;
  private String timeToComplete;

  @Column(nullable = false)
  @Builder.Default
  private boolean isActive = true;

  // Many-to-Many with Interests
  @ManyToMany
  @JoinTable(
      name = "duty_interests",
      joinColumns = @JoinColumn(name = "duty_id"),
      inverseJoinColumns = @JoinColumn(name = "interest_id"))
  private List<Interest> relatedInterests;

  @OneToMany(mappedBy = "duties", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<UserDutyProgress> userProgress;

  @Builder.Default
  @Column(nullable = false)
  private LocalDateTime createdAt = LocalDateTime.now();

  private LocalDateTime updatedAt;

  @PreUpdate
  public void preUpdate() {
    this.updatedAt = LocalDateTime.now();
  }
}
