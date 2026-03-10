package com.mynextduty.core.service;

import com.mynextduty.core.dto.GlobalMessageDto;
import com.mynextduty.core.entity.User;

/**
 * Service responsible for email verification business logic. Handles token generation, validation,
 * and email sending decisions.
 */
public interface VerificationService {

  /**
   * Send verification email if user is not already verified. Used during user registration flow.
   */
  GlobalMessageDto sendVerificationIfRequired(User user);

  /** Resend verification email for logged-in user. Invalidates old tokens and generates new one. */
  GlobalMessageDto resendVerification(User user);

  /** Verify email using token and userId. Validates token and marks user as verified. */
  GlobalMessageDto verifyEmail(String token,Long userId);
}
