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
@Table(name = "goals")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Goal {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String title;

  @Column(length = 1000)
  private String description;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "category_id")
  private Category category;

  @Convert(converter = LifeStageConverter.class)
  @Column(name = "target_life_stage", columnDefinition = "VARCHAR(50)")
  private LifeStage targetLifeStage;

  private String timeframe; // "6 months", "2 years", etc.

  // Many-to-Many with Duties (goals can have multiple duties)
  @ManyToMany
  @JoinTable(
      name = "goal_duties",
      joinColumns = @JoinColumn(name = "goal_id"),
      inverseJoinColumns = @JoinColumn(name = "duty_id"))
  private List<Duties> requiredDuties;

  @OneToMany(mappedBy = "goal", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<UserGoal> userGoals;

  @Builder.Default
  @Column(nullable = false)
  private LocalDateTime createdAt = LocalDateTime.now();

  private LocalDateTime updatedAt;

  @PreUpdate
  public void preUpdate() {
    this.updatedAt = LocalDateTime.now();
  }
}
