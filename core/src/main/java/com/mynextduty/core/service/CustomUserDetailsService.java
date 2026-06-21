package com.mynextduty.core.service;

import com.mynextduty.core.dto.auth.CustomUserDetails;
import com.mynextduty.core.entity.User;
import com.mynextduty.core.exception.UserNotFoundException;
import com.mynextduty.core.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
  private final UserRepository userRepository;

  @Override
  public UserDetails loadUserByUsername(String email) {
    User user =
        userRepository
            .findByEmail(email)
            .orElseThrow(() -> new UserNotFoundException("Invalid email or password"));
    return CustomUserDetails.builder()
        .username(user.getEmail())
        .password(user.getPasswordHash())
        .isVerified(user.isVerified())
        .userId(user.getId())
        .role(user.getRole().getName())
        .build();
  }
}
