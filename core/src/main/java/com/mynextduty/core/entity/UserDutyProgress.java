package com.mynextduty.core.entity;

import com.mynextduty.core.enums.ProgressStatus;
import com.mynextduty.core.converter.ProgressStatusConverter;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
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

@Builder
@Entity
@Table(name = "user_duty_progress")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserDutyProgress {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "duty_id", nullable = false)
  private Duties duties;
  
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;
  
  @Builder.Default
  @Convert(converter = ProgressStatusConverter.class)
  @Column(nullable = false, columnDefinition = "VARCHAR(50)")
  private ProgressStatus status = ProgressStatus.PENDING;
  
  private Integer progressPercentage; // 0-100
  private String notes;
  private LocalDateTime startedAt;
  private LocalDateTime completedAt;
  
  @Builder.Default 
  @Column(nullable = false)
  private LocalDateTime createdAt = LocalDateTime.now();
  
  private LocalDateTime updatedAt;
  
  @PreUpdate
  public void preUpdate() {
    this.updatedAt = LocalDateTime.now();
  }
}
