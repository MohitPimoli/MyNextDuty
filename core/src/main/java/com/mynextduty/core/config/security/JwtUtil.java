package com.mynextduty.core.config.security;

import com.mynextduty.core.dto.auth.CustomUserDetails;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import javax.crypto.SecretKey;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {

  private final String secretKey;
  @Getter private final Long refreshTokenExpiration;

  public JwtUtil(
      @Value("${core.jwt.secret:}") String secretKey,
      @Value("${core.jwt.refresh.expiration:}") Long refreshTokenExpiration) {
    this.secretKey = secretKey;
    this.refreshTokenExpiration = refreshTokenExpiration;
  }

  public String extractUsername(String token) {
    return extractClaim(token, Claims::getSubject);
  }

  public Date extractExpiration(String token) {
    return extractClaim(token, Claims::getExpiration);
  }

  public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
    final Claims claims = extractAllClaims(token);
    return claimsResolver.apply(claims);
  }

  private Claims extractAllClaims(String token) throws ExpiredJwtException {
    return Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(token).getPayload();
  }

  public boolean isTokenExpired(String token) {
    return extractExpiration(token).before(new Date());
  }

  public boolean validateToken(String token, CustomUserDetails customUserDetails) {
    final String username = extractUsername(token);
    return (username.equals(customUserDetails.getUsername()) && !isTokenExpired(token));
  }

  public String generateToken(CustomUserDetails userDetails) {
    return generateToken(new HashMap<>(), userDetails);
  }

  public String generateRefreshToken(CustomUserDetails userDetails) {
    Map<String, Object> extraClaims = new HashMap<>();
    extraClaims.put(
        "roles",
        userDetails.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList());

    return Jwts.builder()
        .claims(extraClaims)
        .subject(userDetails.getUsername())
        .issuedAt(Date.from(Instant.now()))
        .expiration(Date.from(Instant.now().plus(3, ChronoUnit.DAYS)))
        .signWith(getSigningKey(), Jwts.SIG.HS256)
        .compact();
  }

  public String generateToken(
      Map<String, Object> extraClaims, CustomUserDetails customUserDetails) {
    extraClaims.put(
        "roles",
        customUserDetails.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList());

    return Jwts.builder()
        .claims(extraClaims)
        .subject(customUserDetails.getUsername())
        .issuedAt(new Date(System.currentTimeMillis()))
        .expiration(Date.from(Instant.now().plus(15, ChronoUnit.MINUTES)))
        .signWith(getSigningKey(), Jwts.SIG.HS256)
        .compact();
  }

  private SecretKey getSigningKey() {
    return Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
  }

  public void writeCustomErrorResponse(
      HttpServletResponse response, int httpStatus, int errorCode, String errorType, String message)
      throws IOException {
    response.setStatus(httpStatus);
    response.setContentType("application/json");
    response
        .getWriter()
        .write(
            String.format(
                "{\"error\": \"%s\", \"errorCode\": %d, \"message\": \"%s\"}",
                errorType, errorCode, message));
  }
}
