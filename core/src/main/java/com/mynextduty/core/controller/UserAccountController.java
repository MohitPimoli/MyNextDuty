package com.mynextduty.core.controller;

import com.mynextduty.core.dto.GlobalMessageDto;
import com.mynextduty.core.dto.ResponseDto;
import com.mynextduty.core.dto.SuccessResponseDto;
import com.mynextduty.core.dto.user.EducationLevelDto;
import com.mynextduty.core.dto.user.UserProfileUpdateRequestDto;
import com.mynextduty.core.dto.user.UserResponseDto;
import com.mynextduty.core.service.UserAccountService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserAccountController {
  private final UserAccountService userAccountService;

  @PostMapping("/verify")
  public ResponseDto<GlobalMessageDto> verify() {
    return new SuccessResponseDto<>(userAccountService.verify());
  }

  @GetMapping("/profile")
  public ResponseDto<UserResponseDto> getProfile() {
    return new SuccessResponseDto<>(userAccountService.getUserProfile());
  }

  @PutMapping("/profile")
  public ResponseDto<UserResponseDto> updateProfile(
      @Valid @RequestBody UserProfileUpdateRequestDto dto) {
    return new SuccessResponseDto<>(userAccountService.updateUserProfile(dto));
  }

  @GetMapping("/education-levels")
  public ResponseDto<List<EducationLevelDto>> getEducationLevels() {
    return new SuccessResponseDto<>(userAccountService.getActiveEducationLevels());
  }
}
