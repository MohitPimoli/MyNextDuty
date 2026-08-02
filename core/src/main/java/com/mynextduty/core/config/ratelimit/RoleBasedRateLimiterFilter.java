package com.mynextduty.core.config.ratelimit;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mynextduty.core.dto.auth.CustomUserDetails;
import com.mynextduty.core.service.RedisService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.lang.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Distributed rate limiter using Redis + Lua script with token bucket algorithm and burst support.
 *
 * <p>The Lua script atomically:
 *
 * <ul>
 *   <li>Refills tokens based on elapsed time since last refill
 *   <li>Caps tokens at burst capacity (allows short traffic spikes)
 *   <li>Attempts to consume one token
 *   <li>Returns remaining tokens (or -1 if rejected)
 * </ul>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RoleBasedRateLimiterFilter extends OncePerRequestFilter {

  private final RedisService redisService;
  private final ObjectMapper objectMapper;
  private final RateLimitProperties properties;

  /**
   * Token bucket Lua script with burst support.
   *
   * <p>KEYS[1] = bucket key (hash with fields: tokens, last_refill)
   *
   * <p>ARGV[1] = burst capacity (max tokens the bucket can hold)
   *
   * <p>ARGV[2] = refill rate (tokens added per second)
   *
   * <p>ARGV[3] = current time in milliseconds
   *
   * <p>ARGV[4] = tokens to consume (1)
   *
   * <p>Returns: remaining tokens after consumption, or -1 if request is rejected.
   */
  private static final String TOKEN_BUCKET_LUA_SCRIPT =
      """
      local key = KEYS[1]
      local burst_capacity = tonumber(ARGV[1])
      local refill_rate = tonumber(ARGV[2])
      local now = tonumber(ARGV[3])
      local requested = tonumber(ARGV[4])

      local bucket = redis.call('HMGET', key, 'tokens', 'last_refill')
      local tokens = tonumber(bucket[1])
      local last_refill = tonumber(bucket[2])

      -- Initialize bucket if it doesn't exist
      if tokens == nil then
        tokens = burst_capacity
        last_refill = now
      end

      -- Calculate token refill based on elapsed time
      local elapsed_ms = now - last_refill
      if elapsed_ms > 0 then
        local refill_amount = (elapsed_ms / 1000.0) * refill_rate
        tokens = math.min(burst_capacity, tokens + refill_amount)
        last_refill = now
      end

      -- Try to consume token
      local allowed = 0
      local remaining = tokens

      if tokens >= requested then
        remaining = tokens - requested
        allowed = 1
      end

      -- Persist state with TTL (2x refill window to auto-cleanup inactive buckets)
      redis.call('HSET', key, 'tokens', remaining, 'last_refill', last_refill)
      local ttl = math.ceil(burst_capacity / refill_rate) * 2
      redis.call('EXPIRE', key, ttl)

      if allowed == 1 then
        return math.floor(remaining)
      else
        return -1
      end
      """;

  @Override
  protected void doFilterInternal(
      @NonNull HttpServletRequest request,
      @NonNull HttpServletResponse response,
      @NonNull FilterChain filterChain)
      throws ServletException, IOException {

    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

    if (authentication != null
        && authentication.getPrincipal() instanceof CustomUserDetails userDetails) {
      int burstCapacity = properties.getBurstCapacityForRole(resolveRole(userDetails));
      Long result =
          redisService.executeLuaScript(
              TOKEN_BUCKET_LUA_SCRIPT,
              List.<Object>of(properties.getRateLimitKeyPrefix() + ":" + userDetails.getUserId()),
              String.valueOf(burstCapacity),
              String.valueOf(
                  (double) properties.getRefillTokens() / properties.getRefillDuration()),
              String.valueOf(System.currentTimeMillis()),
              "1");

      if (result == null || result < 0) {
        writeRateLimitExceededResponse(response);
        return;
      }
      response.setHeader("X-Rate-Limit-Remaining", String.valueOf(result));
      response.setHeader("X-Rate-Limit-Burst-Capacity", String.valueOf(burstCapacity));
      filterChain.doFilter(request, response);
      return;
    }
    filterChain.doFilter(request, response);
  }

  /** Resolves the highest-priority role from the user's authorities. */
  private String resolveRole(CustomUserDetails userDetails) {
    if (userDetails.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"))) {
      return "ADMIN";
    } else if (userDetails.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_CUSTOMER"))) {
      return "CUSTOMER";
    }
    return "DEFAULT";
  }

  private void writeRateLimitExceededResponse(HttpServletResponse response) throws IOException {
    response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
    response.setHeader("X-Rate-Limit-Retry-After", String.valueOf(properties.getRefillDuration()));
    Map<String, Object> errorResponse =
        Map.of(
            "status", "TOO_MANY_REQUESTS",
            "code", HttpStatus.TOO_MANY_REQUESTS.value(),
            "message", "Rate limit exceeded. Please try again later.",
            "retryAfterSeconds", properties.getRefillDuration(),
            "timestamp", System.currentTimeMillis());
    objectMapper.writeValue(response.getOutputStream(), errorResponse);
  }

  @Override
  protected boolean shouldNotFilter(HttpServletRequest request) {
    String path = request.getServletPath();
    return path.startsWith("/auth");
  }
}
