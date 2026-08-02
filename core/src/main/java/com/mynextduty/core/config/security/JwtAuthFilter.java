package com.mynextduty.core.config.security;

import com.mynextduty.core.dto.auth.CustomUserDetails;
import com.mynextduty.core.service.BlackListTokenService;
import com.mynextduty.core.service.CustomUserDetailsService;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Service;
import org.springframework.web.filter.OncePerRequestFilter;

@Slf4j
@Service
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

  private final JwtUtil jwtUtil;
  private final CustomUserDetailsService userDetailsService;
  private final BlackListTokenService blackListTokenService;

  @Override
  protected void doFilterInternal(
      HttpServletRequest request,
      @NonNull HttpServletResponse response,
      @NonNull FilterChain filterChain)
      throws ServletException, IOException {
    String authHeader = request.getHeader("Authorization");
    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
      jwtUtil.writeCustomErrorResponse(
          response,
          HttpServletResponse.SC_UNAUTHORIZED,
          4001,
          "InvalidAuthorizationHeader",
          "Missing or invalid Authorization header.");
      return;
    }
    String token = authHeader.substring(7).trim();
    try {
      if (blackListTokenService.isTokenBlackListed(token)) {
        jwtUtil.writeCustomErrorResponse(
            response,
            HttpServletResponse.SC_UNAUTHORIZED,
            4001,
            "BlacklistedToken",
            "Token is blacklisted.");
        return;
      }
      String username = jwtUtil.extractUsername(token);
      if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
        CustomUserDetails customUserDetails =
            (CustomUserDetails) userDetailsService.loadUserByUsername(username);
        if (jwtUtil.validateToken(token, customUserDetails)) {
          UsernamePasswordAuthenticationToken authToken =
              new UsernamePasswordAuthenticationToken(
                  customUserDetails, null, customUserDetails.getAuthorities());
          authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
          SecurityContextHolder.getContext().setAuthentication(authToken);
        }
      }
    } catch (ExpiredJwtException e) {
      if (!blackListTokenService.isTokenBlackListed(token)
          && blackListTokenService.blackListAccessToken(token)) {
        log.info("Expired access token blacklisted: {}", token);
      }
      jwtUtil.writeCustomErrorResponse(
          response,
          HttpServletResponse.SC_UNAUTHORIZED,
          4001,
          "AccessTokenExpired",
          "Access token has expired");
      return;
    } catch (Exception e) {
      log.error("Token validation failed", e);
      jwtUtil.writeCustomErrorResponse(
          response,
          HttpServletResponse.SC_UNAUTHORIZED,
          4003,
          "InvalidAccessToken",
          "Your access token was invalid or tampered. Please login again.");
      return;
    }
    filterChain.doFilter(request, response);
  }

  @Override
  protected boolean shouldNotFilter(HttpServletRequest request) {
    String path = request.getServletPath();
    return path.startsWith("/auth");
  }
}
