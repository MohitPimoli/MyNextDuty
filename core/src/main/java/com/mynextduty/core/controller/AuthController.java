package com.mynextduty.core.controller;

import com.mynextduty.core.dto.GlobalMessageDto;
import com.mynextduty.core.dto.ResponseDto;
import com.mynextduty.core.dto.SuccessResponseDto;
import com.mynextduty.core.dto.auth.AuthRequestDto;
import com.mynextduty.core.dto.auth.AuthResponseDto;
import com.mynextduty.core.dto.user.UserRegisterRequestDto;
import com.mynextduty.core.entity.User;
import com.mynextduty.core.service.AuthService;
import com.mynextduty.core.service.CurrentUserService;
import com.mynextduty.core.service.UserAccountService;
import com.mynextduty.core.service.VerificationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
  private final AuthService authService;
  private final VerificationService verificationService;
  private final CurrentUserService currentUserService;
  private final UserAccountService userAccountService;

  @GetMapping("/public-key")
  public ResponseDto<String> publicKey() {
    return new SuccessResponseDto<>(authService.publicKey());
  }

  @PostMapping("/login")
  public ResponseDto<AuthResponseDto> login(
      @Valid @RequestBody AuthRequestDto loginDto, HttpServletResponse response) {
    return new SuccessResponseDto<>(authService.login(loginDto, response));
  }

  @GetMapping("/refresh")
  public ResponseDto<AuthResponseDto> refreshToken(
      HttpServletRequest request, HttpServletResponse httpServletResponse) {
    return new SuccessResponseDto<>(authService.refreshToken(request, httpServletResponse));
  }

  @PostMapping("/logout")
  public ResponseDto<GlobalMessageDto> logout(HttpServletRequest request) {
    return new SuccessResponseDto<>(authService.logout(request));
  }

  /**
   * FLOW C: Verify email using token from email link Public endpoint - no authentication required
   */
  @GetMapping("/verify-email")
  public ResponseDto<GlobalMessageDto> verifyEmail(@RequestParam String token) {
    GlobalMessageDto result = verificationService.verifyEmail(token);
    return new SuccessResponseDto<>(result);
  }

  /** FLOW B: Resend verification email for logged-in user Requires authentication */
  @PostMapping("/resend-verification")
  public ResponseDto<GlobalMessageDto> resendVerification() {
    User currentUser = currentUserService.getCurrentUser();
    GlobalMessageDto result = verificationService.resendVerification(currentUser);
    return new SuccessResponseDto<>(result);
  }

  @PostMapping("/register")
  public ResponseDto<GlobalMessageDto> register(
      @Valid @RequestBody UserRegisterRequestDto registerDto, HttpServletResponse response) {
    return new SuccessResponseDto<>(userAccountService.register(registerDto, response));
  }
}
