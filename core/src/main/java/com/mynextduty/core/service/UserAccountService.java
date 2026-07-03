package com.mynextduty.core.service;

import com.mynextduty.core.dto.GlobalMessageDto;
import com.mynextduty.core.dto.user.EducationLevelDto;
import com.mynextduty.core.dto.user.UserProfileUpdateRequestDto;
import com.mynextduty.core.dto.user.UserRegisterRequestDto;
import com.mynextduty.core.dto.user.UserResponseDto;
import jakarta.servlet.http.HttpServletResponse;
import java.util.List;

public interface UserAccountService {
  GlobalMessageDto register(
      UserRegisterRequestDto registerRequestDto, HttpServletResponse httpServletResponse);

  GlobalMessageDto verifyEmail();

  GlobalMessageDto verify();

  UserResponseDto getUserProfile();

  UserResponseDto updateUserProfile(UserProfileUpdateRequestDto dto);

  List<EducationLevelDto> getActiveEducationLevels();
}
