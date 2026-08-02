package com.mynextduty.core.controller;

import com.mynextduty.core.dto.DutyRecommendationDto;
import com.mynextduty.core.dto.ResponseDto;
import com.mynextduty.core.dto.SuccessResponseDto;
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

  @GetMapping("/personalized")
  public ResponseDto<List<DutyRecommendationDto>> getPersonalized() {
    return new SuccessResponseDto<>(recommendationService.getPersonalizedRecommendations());
  }

  @GetMapping("/by-life-stage")
  public ResponseDto<List<DutyRecommendationDto>> getByLifeStage() {
    return new SuccessResponseDto<>(recommendationService.getRecommendationsByLifeStage());
  }

  @GetMapping("/by-interests")
  public ResponseDto<List<DutyRecommendationDto>> getByInterests() {
    return new SuccessResponseDto<>(recommendationService.getRecommendationsByInterests());
  }

  @GetMapping("/critical")
  public ResponseDto<List<DutyRecommendationDto>> getCritical() {
    return new SuccessResponseDto<>(recommendationService.getCriticalRecommendations());
  }
}
