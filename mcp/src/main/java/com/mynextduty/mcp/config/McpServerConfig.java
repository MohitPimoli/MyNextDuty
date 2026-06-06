package com.mynextduty.mcp.config;

import com.mynextduty.mcp.tools.location.LocationTools;
import com.mynextduty.mcp.tools.recommendation.RecommendationTools;
import com.mynextduty.mcp.tools.user.UserTools;
import org.springframework.ai.tool.ToolCallbackProvider;
import org.springframework.ai.tool.method.MethodToolCallbackProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class McpServerConfig {

    @Bean
    public ToolCallbackProvider toolCallbackProvider(UserTools userTools,
                                                    LocationTools locationTools,
                                                    RecommendationTools recommendationTools) {
        return MethodToolCallbackProvider.builder()
                .toolObjects(userTools, locationTools, recommendationTools)
                .build();
    }
}
