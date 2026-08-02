package com.mynextduty.core.service.impl;

import com.mynextduty.core.config.security.PassDecryptor;
import com.mynextduty.core.dto.GlobalMessageDto;
import com.mynextduty.core.dto.user.EducationLevelDto;
import com.mynextduty.core.dto.user.UserProfileUpdateRequestDto;
import com.mynextduty.core.dto.user.UserRegisterRequestDto;
import com.mynextduty.core.dto.user.UserResponseDto;
import com.mynextduty.core.entity.EducationLevel;
import com.mynextduty.core.entity.User;
import com.mynextduty.core.exception.GenericApplicationException;
import com.mynextduty.core.repository.EducationLevelRepository;
import com.mynextduty.core.repository.RoleRepository;
import com.mynextduty.core.repository.UserRepository;
import com.mynextduty.core.service.CurrentUserService;
import com.mynextduty.core.service.UserAccountService;
import com.mynextduty.core.service.VerificationService;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Comparator;
import java.util.List;
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
  private final RoleRepository roleRepository;
  private final EducationLevelRepository educationLevelRepository;

  @Override
  @Transactional
  public GlobalMessageDto register(
      UserRegisterRequestDto registerRequestDto, HttpServletResponse httpServletResponse) {
    if (userRepository.findByEmail(registerRequestDto.getEmail()).isPresent()) {
      throw new GenericApplicationException("User already exists.", 409);
    }
    User savedUser =
        userRepository.save(
            User.builder()
                .email(registerRequestDto.getEmail())
                .passwordHash(
                    passwordEncoder.encode(
                        passDecryptor.decryptPassword(registerRequestDto.getPassword())))
                .firstName(registerRequestDto.getFirstName())
                .lastName(registerRequestDto.getLastName())
                .isVerified(false)
                .role(roleRepository.findById(3L).get())
                .build());
    verificationService.sendVerificationIfRequired(savedUser);
    return GlobalMessageDto.builder()
        .message("User registered successfully. Please check your email to verify your account.")
        .build();
  }

  @Override
  public GlobalMessageDto verify() {
    return verificationService.resendVerification(currentUserService.getCurrentUser());
  }

  @Override
  public UserResponseDto getUserProfile() {
    return buildUserResponseDto(currentUserService.getCurrentUser());
  }

  @Override
  @Transactional
  public UserResponseDto updateUserProfile(UserProfileUpdateRequestDto dto) {
    User user = currentUserService.getCurrentUser();
    user.setFirstName(dto.getFirstName());
    if (dto.getLastName() != null) user.setLastName(dto.getLastName());
    if (dto.getDateOfBirth() != null) user.setDateOfBirth(dto.getDateOfBirth());
    if (dto.getLifeStage() != null) user.setLifeStage(dto.getLifeStage());
    if (dto.getCurrentOccupation() != null) user.setCurrentOccupation(dto.getCurrentOccupation());
    if (dto.getMonthlyIncome() != null) user.setMonthlyIncome(dto.getMonthlyIncome());
    if (dto.getEducationLevelCode() != null) {
      user.setEducationLevel(
          educationLevelRepository
              .findByLevelCode(dto.getEducationLevelCode())
              .filter(EducationLevel::isActive)
              .orElseThrow(
                  () -> new GenericApplicationException("Education level not found.", 400)));
    }
    return buildUserResponseDto(userRepository.save(user));
  }

  @Override
  public List<EducationLevelDto> getActiveEducationLevels() {
    return educationLevelRepository.findAll().stream()
        .filter(EducationLevel::isActive)
        .sorted(
            Comparator.comparing(
                EducationLevel::getLevelRank, Comparator.nullsLast(Comparator.naturalOrder())))
        .map(e -> new EducationLevelDto(e.getLevelCode(), e.getLevelName()))
        .toList();
  }

  private UserResponseDto buildUserResponseDto(User user) {
    return UserResponseDto.builder()
        .id(user.getId())
        .firstName(user.getFirstName())
        .lastName(user.getLastName())
        .email(user.getEmail())
        .dateOfBirth(user.getDateOfBirth())
        .lifeStage(user.getLifeStage())
        .currentOccupation(user.getCurrentOccupation())
        .monthlyIncome(user.getMonthlyIncome())
        .educationLevel(
            user.getEducationLevel() != null ? user.getEducationLevel().getLevelName() : null)
        .isVerified(user.isVerified())
        .build();
  }
}
