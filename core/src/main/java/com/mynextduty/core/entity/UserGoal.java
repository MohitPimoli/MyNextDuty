package com.mynextduty.core.entity;

import com.mynextduty.core.enums.ProgressStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "user_goals")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserGoal {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;
  
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "goal_id", nullable = false)
  private Goal goal;
  
  @Builder.Default
  @Column(nullable = false, columnDefinition = "VARCHAR(50)")
  private ProgressStatus status = ProgressStatus.PENDING;
  
  private LocalDateTime targetDate;
  private LocalDateTime startedAt;
  private LocalDateTime completedAt;
  
  private String personalNotes;
  
  @Builder.Default 
  @Column(nullable = false)
  private LocalDateTime createdAt = LocalDateTime.now();
  
  private LocalDateTime updatedAt;
  
  @PreUpdate
  public void preUpdate() {
    this.updatedAt = LocalDateTime.now();
  }
}