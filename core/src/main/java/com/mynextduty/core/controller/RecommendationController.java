package com.mynextduty.core.controller;

import com.mynextduty.core.dto.DutyRecommendationDto;
import com.mynextduty.core.dto.ResponseDto;
import com.mynextduty.core.dto.SuccessResponseDto;
import com.mynextduty.core.service.CurrentUserService;
import com.mynextduty.core.service.RecommendationService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

  private final RecommendationService recommendationService;
  private final CurrentUserService currentUserService;

  @GetMapping("/personalized")
  public ResponseDto<List<DutyRecommendationDto>> getPersonalized() {
    Long userId = currentUserService.getCurrentUserId();
    return new SuccessResponseDto<>(recommendationService.getPersonalizedRecommendations(userId));
  }

  @GetMapping("/by-life-stage")
  public ResponseDto<List<DutyRecommendationDto>> getByLifeStage() {
    Long userId = currentUserService.getCurrentUserId();
    return new SuccessResponseDto<>(recommendationService.getRecommendationsByLifeStage(userId));
  }

  @GetMapping("/by-interests")
  public ResponseDto<List<DutyRecommendationDto>> getByInterests() {
    Long userId = currentUserService.getCurrentUserId();
    return new SuccessResponseDto<>(recommendationService.getRecommendationsByInterests(userId));
  }

  @GetMapping("/critical")
  public ResponseDto<List<DutyRecommendationDto>> getCritical() {
    Long userId = currentUserService.getCurrentUserId();
    return new SuccessResponseDto<>(recommendationService.getCriticalRecommendations(userId));
  }
}
