package com.mynextduty.core.controller;

import com.mynextduty.core.dto.DutyRecommendationDto;
import com.mynextduty.core.dto.ResponseDto;
import com.mynextduty.core.dto.SuccessResponseDto;
import com.mynextduty.core.service.RecommendationService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

  private final RecommendationService recommendationService;

  @GetMapping("/personalized")
  public ResponseDto<List<DutyRecommendationDto>> getPersonalizedRecommendations(
      Authentication authentication) {
    Long userId = getUserIdFromAuth(authentication);
    return new SuccessResponseDto<>(recommendationService.getPersonalizedRecommendations(userId));
  }

  @GetMapping("/by-life-stage")
  public ResponseDto<List<DutyRecommendationDto>> getRecommendationsByLifeStage(
      Authentication authentication) {
    Long userId = getUserIdFromAuth(authentication);
    return new SuccessResponseDto<>(recommendationService.getRecommendationsByLifeStage(userId));
  }

  @GetMapping("/by-interests")
  public ResponseDto<List<DutyRecommendationDto>> getRecommendationsByInterests(
      Authentication authentication) {
    Long userId = getUserIdFromAuth(authentication);
    return new SuccessResponseDto<>(recommendationService.getRecommendationsByInterests(userId));
  }

  @GetMapping("/critical")
  public ResponseDto<List<DutyRecommendationDto>> getCriticalRecommendations(
      Authentication authentication) {
    Long userId = getUserIdFromAuth(authentication);
    return new SuccessResponseDto<>(recommendationService.getCriticalRecommendations(userId));
  }

  // Helper method - in a real app, you'd get this from JWT or user context
  private Long getUserIdFromAuth(Authentication authentication) {
    // This is a placeholder - you'd implement proper user ID extraction
    // from your JWT token or authentication context
    return 1L; // For now, return a default user ID
  }
}
