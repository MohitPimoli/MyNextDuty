package com.mynextduty.core.service.impl;

import com.mynextduty.core.dto.auth.CustomUserDetails;
import com.mynextduty.core.entity.User;
import com.mynextduty.core.exception.GenericApplicationException;
import com.mynextduty.core.repository.UserRepository;
import com.mynextduty.core.service.CurrentUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CurrentUserServiceImpl implements CurrentUserService {

  private final UserRepository userRepository;

  @Override
  public User getCurrentUser() {
    Long userId = getCurrentUserId();
    return userRepository
        .findById(userId)
        .orElseThrow(
            () -> {
              log.error("User not found with userId:{}", userId);
              return new GenericApplicationException("User not found", 404);
            });
  }

  @Override
  public Long getCurrentUserId() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null || !authentication.isAuthenticated()) {
      log.error("authentication is either null or the User in not authenticated.");
      throw new GenericApplicationException("User not found", 400);
    }
    Object userDetailsObj = authentication.getPrincipal();
    if (userDetailsObj instanceof CustomUserDetails customUserDetails) {
      return customUserDetails.getUserId();
    }
    if (userDetailsObj instanceof String email) {
      return userRepository
          .findUserIdByEmail(email)
          .orElseThrow(
              () -> {
                log.error("User not found with email:{}", email);
                return new GenericApplicationException("User not found.", 404);
              });
    }
    throw new GenericApplicationException("Unsupported authentication principal", 401);
  }

  @Override
  public boolean isAuthenticated() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    return authentication != null
        && authentication.isAuthenticated()
        && !(authentication instanceof AnonymousAuthenticationToken);
  }

  @Override
  public boolean isVerified() {
    if (!isAuthenticated()) {
      return false;
    }
    return getCurrentUser().isVerified();
  }
}
