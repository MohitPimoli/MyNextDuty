package com.mynextduty.core.service;

import com.mynextduty.core.dto.DutyRecommendationDto;
import java.util.List;

public interface RecommendationService {

    List<DutyRecommendationDto> getPersonalizedRecommendations();
    List<DutyRecommendationDto> getRecommendationsByLifeStage();
    List<DutyRecommendationDto> getRecommendationsByInterests();
    List<DutyRecommendationDto> getCriticalRecommendations();

}
