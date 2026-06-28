package com.mynextduty.core.service;

import com.mynextduty.core.dto.DutyRecommendationDto;
import java.util.List;

public interface RecommendationService {

    List<DutyRecommendationDto> getPersonalizedRecommendations(Long userId);
    List<DutyRecommendationDto> getRecommendationsByLifeStage(Long userId);
    List<DutyRecommendationDto> getRecommendationsByInterests(Long userId);
    List<DutyRecommendationDto> getCriticalRecommendations(Long userId);

}
