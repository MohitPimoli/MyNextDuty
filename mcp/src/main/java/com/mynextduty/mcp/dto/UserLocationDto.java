package com.mynextduty.mcp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserLocationDto {
    private Long userId;
    private Double latitude;
    private Double longitude;
}
