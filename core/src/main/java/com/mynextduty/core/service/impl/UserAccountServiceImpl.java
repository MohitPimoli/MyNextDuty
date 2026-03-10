package com.mynextduty.core.service.impl;

import com.mynextduty.core.config.security.PassDecryptor;
import com.mynextduty.core.dto.GlobalMessageDto;
import com.mynextduty.core.dto.user.UserRegisterRequestDto;
import com.mynextduty.core.entity.User;
import com.mynextduty.core.exception.GenericApplicationException;
import com.mynextduty.core.repository.UserRepository;
import com.mynextduty.core.service.CurrentUserService;
import com.mynextduty.core.service.UserAccountService;
import com.mynextduty.core.service.VerificationService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserAccountServiceImpl implements UserAccountService {
  private final UserRepository userRepository;
  private final VerificationService verificationService;
  private final CurrentUserService currentUserService;
  private final PassDecryptor passDecryptor;
  private final PasswordEncoder passwordEncoder;

  @Override
  @Transactional
  public GlobalMessageDto register(
      UserRegisterRequestDto registerRequestDto, HttpServletResponse httpServletResponse) {
    if (userRepository.findByEmail(registerRequestDto.getEmail()).isPresent()) {
      throw new GenericApplicationException("User already exists.", 409);
    }
    User user =
        User.builder()
            .email(registerRequestDto.getEmail())
            .passwordHash(
                passwordEncoder.encode(
                    passDecryptor.decryptPassword(registerRequestDto.getPassword())))
            .firstName(registerRequestDto.getFirstName())
            .lastName(registerRequestDto.getLastName())
            .isVerified(false)
            .build();
    User savedUser = userRepository.save(user);
    log.debug("New user registered with email: {}", registerRequestDto.getEmail());
    verificationService.sendVerificationIfRequired(savedUser);
    return GlobalMessageDto.builder()
        .message("User registered successfully. Please check your email to verify your account.")
        .build();
  }

  @Override
  public GlobalMessageDto verifyEmail(String token) {
    return verificationService.verifyEmail(token, currentUserService.getCurrentUserId());
  }

  @Override
  public GlobalMessageDto verify() {
    User user = currentUserService.getCurrentUser();
    return verificationService.resendVerification(user);
  }
}
