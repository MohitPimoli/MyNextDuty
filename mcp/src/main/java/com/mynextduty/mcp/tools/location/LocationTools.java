package com.mynextduty.mcp.tools.location;

import com.mynextduty.mcp.dto.UserLocationDto;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class LocationTools {

    private static final Map<Long, UserLocationDto> DUMMY_LOCATIONS = Map.of(
            1L, UserLocationDto.builder().userId(1L).latitude(28.6139).longitude(77.2090).build(),
            2L, UserLocationDto.builder().userId(2L).latitude(19.0760).longitude(72.8777).build(),
            3L, UserLocationDto.builder().userId(3L).latitude(12.9716).longitude(77.5946).build()
    );

    @Tool(description = "Get the location of a user by their user ID")
    public UserLocationDto getUserLocation(Long userId) {
        return DUMMY_LOCATIONS.getOrDefault(userId,
                UserLocationDto.builder().userId(userId).latitude(0.0).longitude(0.0).build());
    }
}
