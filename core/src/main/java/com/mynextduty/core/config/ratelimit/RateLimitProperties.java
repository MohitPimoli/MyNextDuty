package com.mynextduty.core.config.ratelimit;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@RequiredArgsConstructor
@ToString
@Component
@ConfigurationProperties(prefix = "core.rate-limit")
public class RateLimitProperties {

  /** Tokens added per refill cycle */
  private int refillTokens;

  private String rateLimitKeyPrefix;

  /** Refill interval in seconds */
  private int refillDuration;

  /** Default bucket capacity (sustained limit) */
  private int defaultLimit;

  /** Admin bucket capacity */
  private int adminLimit;

  /** Customer bucket capacity */
  private int customerLimit;

  /** Burst multiplier — burst capacity = limit * burstMultiplier */
  private double burstMultiplier = 1.5;

  /**
   * Returns the sustained rate limit for a given role.
   *
   * @param role The role for which to get the rate limit.
   * @return The rate limit for the specified role.
   */
  public int getLimitForRole(String role) {
    return switch (role.toUpperCase()) {
      case "ADMIN" -> adminLimit;
      case "CUSTOMER" -> customerLimit;
      default -> defaultLimit;
    };
  }

  /**
   * Returns the burst capacity for a given role. Burst allows short traffic spikes above the
   * sustained rate.
   *
   * @param role The role for which to get the burst capacity.
   * @return The burst capacity for the specified role.
   */
  public int getBurstCapacityForRole(String role) {
    return (int) Math.ceil(getLimitForRole(role) * burstMultiplier);
  }
}
