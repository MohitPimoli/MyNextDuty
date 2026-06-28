package com.mynextduty.core.service.impl;

import com.mynextduty.core.config.security.JwtUtil;
import com.mynextduty.core.config.security.PassDecryptor;
import com.mynextduty.core.dto.GlobalMessageDto;
import com.mynextduty.core.dto.auth.AuthRequestDto;
import com.mynextduty.core.dto.auth.AuthResponseDto;
import com.mynextduty.core.dto.auth.CustomUserDetails;
import com.mynextduty.core.entity.User;
import com.mynextduty.core.exception.GenericApplicationException;
import com.mynextduty.core.exception.KeyLoadingException;
import com.mynextduty.core.exception.TokenException;
import com.mynextduty.core.exception.UserNotFoundException;
import com.mynextduty.core.repository.UserRepository;
import com.mynextduty.core.service.AuthService;
import com.mynextduty.core.service.BlackListTokenService;
import com.mynextduty.core.service.CustomUserDetailsService;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.mynextduty.core.utils.Constants.PUBLIC_KEY_PATH;
import static com.mynextduty.core.utils.Constants.REFRESH_TOKEN;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

  private final AuthenticationManager authenticationManager;
  private final UserRepository userRepository;
  private final PassDecryptor passDecryptor;
  private final JwtUtil jwtUtil;
  private final CustomUserDetailsService customUserDetailsService;
  private final BlackListTokenService blacklistToken;

  @Override
  public String publicKey() {
    try (InputStream is = getClass().getResourceAsStream(PUBLIC_KEY_PATH)) {
      if (is == null) {
        throw new KeyLoadingException("Public key file not found in " + PUBLIC_KEY_PATH);
      }
      return new String(is.readAllBytes(), StandardCharsets.UTF_8);
    } catch (IOException e) {
      throw new KeyLoadingException("Failed to read public key", e);
    } catch (Exception e) {
      throw new GenericApplicationException(
          "Unexpected error loading public key", e.getCause(), 500);
    }
  }

  @Override
  @Transactional
  public AuthResponseDto login(
      AuthRequestDto authRequestDto, HttpServletResponse httpServletResponse) {
    CustomUserDetails customUserDetails =
        (CustomUserDetails) customUserDetailsService.loadUserByUsername(authRequestDto.getEmail());
      String decryptedPassword = passDecryptor.decryptPassword(authRequestDto.getPassword());
      authenticationManager.authenticate(
          new UsernamePasswordAuthenticationToken(authRequestDto.getEmail(), decryptedPassword));
    User user =
        userRepository
            .findByEmail(authRequestDto.getEmail())
            .orElseThrow(
                () -> {
                  log.warn("User not found: {}", authRequestDto.getEmail());
                  return new UserNotFoundException("Invalid email or password");
                });
    user.setLastAccessTime(LocalDateTime.now());
    userRepository.save(user);
    String token = jwtUtil.generateToken(customUserDetails);
    String refreshToken = jwtUtil.generateRefreshToken(customUserDetails);
    setRefreshTokenCookie(httpServletResponse, refreshToken);
    return AuthResponseDto.builder()
        .id(user.getId().toString())
        .email(user.getEmail())
        .accessToken(token)
        .refreshToken(refreshToken)
        .build();
  }

  @Override
  public AuthResponseDto refreshToken(
      HttpServletRequest request, HttpServletResponse httpServletResponse) {
    String oldRefreshToken = null;
    if (request.getCookies() != null) {
      for (Cookie cookie : request.getCookies()) {
        if (REFRESH_TOKEN.equals(cookie.getName())) {
          oldRefreshToken = cookie.getValue();
          break;
        }
      }
    }
    if (oldRefreshToken == null) {
      throw new TokenException("Invalid refresh token");
    }
    try {
      String email = jwtUtil.extractUsername(oldRefreshToken);
      if (jwtUtil.isTokenExpired(oldRefreshToken)) {
        throw new ExpiredJwtException(null, null, "Refresh token expired");
      }
      blacklistToken.blackListRefreshToken(oldRefreshToken);
      CustomUserDetails userDetails =
          (CustomUserDetails) customUserDetailsService.loadUserByUsername(email);
      String newAccessToken = jwtUtil.generateToken(userDetails);
      String newRefreshToken = jwtUtil.generateRefreshToken(userDetails);
      setRefreshTokenCookie(httpServletResponse, newRefreshToken);
      return AuthResponseDto.builder()
          .email(email)
          .accessToken(newAccessToken)
          .refreshToken(newRefreshToken)
          .build();
    } catch (TokenException | ExpiredJwtException e) {
      blacklistToken.blackListRefreshToken(oldRefreshToken);
      throw e;
    } catch (Exception ex) {
      throw new GenericApplicationException("Unable to refresh token", ex, 500);
    }
  }

  @Override
  public GlobalMessageDto logout(HttpServletRequest httpServletRequest) {
    return null;
  }

  private void setRefreshTokenCookie(HttpServletResponse httpServletResponse, String refreshToken) {
    ResponseCookie refreshTokenCookie =
        ResponseCookie.from(REFRESH_TOKEN, refreshToken)
            .httpOnly(true)
            .secure(true)
            .path("/")
            .sameSite("Strict")
            .maxAge(jwtUtil.getRefreshTokenExpiration())
            .build();
    httpServletResponse.addHeader(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());
  }
}
