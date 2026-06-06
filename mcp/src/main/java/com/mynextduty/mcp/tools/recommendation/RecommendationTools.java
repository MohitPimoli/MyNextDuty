package com.mynextduty.mcp.tools.recommendation;

import com.mynextduty.mcp.dto.RecommendationDto;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class RecommendationTools {

    private static final Map<Long, List<RecommendationDto>> DUMMY_RECOMMENDATIONS = Map.of(
            1L, List.of(
                    RecommendationDto.builder().id(101L).title("Start Emergency Fund").description("Save 3-6 months of expenses").build(),
                    RecommendationDto.builder().id(102L).title("Health Insurance").description("Get a comprehensive health plan").build()
            ),
            2L, List.of(
                    RecommendationDto.builder().id(201L).title("Invest in SIP").description("Start a monthly SIP of 5000").build()
            ),
            3L, List.of(
                    RecommendationDto.builder().id(301L).title("Upskill in Cloud").description("Take an AWS certification course").build()
            )
    );

    @Tool(description = "Get duty recommendations for a user by their user ID")
    public List<RecommendationDto> getRecommendation(Long userId) {
        return DUMMY_RECOMMENDATIONS.getOrDefault(userId, List.of());
    }
}
