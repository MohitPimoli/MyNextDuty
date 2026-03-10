package com.mynextduty.core.service.impl;

import com.mynextduty.core.dto.GlobalMessageDto;
import com.mynextduty.core.dto.NotificationRequest;
import com.mynextduty.core.entity.EmailVerificationToken;
import com.mynextduty.core.entity.User;
import com.mynextduty.core.enums.NotificationType;
import com.mynextduty.core.enums.TemplateType;
import com.mynextduty.core.repository.EmailVerificationTokenRepository;
import com.mynextduty.core.repository.UserRepository;
import com.mynextduty.core.service.NotificationService;
import com.mynextduty.core.service.VerificationService;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.mynextduty.core.utils.Constants.EXPIRY_MINUTES;
import static com.mynextduty.core.utils.Constants.NAME;
import static com.mynextduty.core.utils.Constants.VERIFICATION_LINK;

@Service
@RequiredArgsConstructor
@Slf4j
public class VerificationServiceImpl implements VerificationService {

  private final NotificationService notificationService;
  private final EmailVerificationTokenRepository tokenRepository;
  private final UserRepository userRepository;

  @Value("${core.email.verification.tokenExpiryMinutes:}")
  private int tokenExpiryMinutes;

  @Value("${core.baseUrl:http://localhost:5173}")
  private String baseUrl;

  @Override
  @Transactional
  public GlobalMessageDto sendVerificationIfRequired(User user) {
    if (user.isVerified()) {
      log.info("User {} already verified, skipping verification email", user.getEmail());
      return GlobalMessageDto.builder().message("Email is already verified").build();
    }
    return sendVerificationEmail(user);
  }

  @Override
  @Transactional
  public GlobalMessageDto resendVerification(User user) {
    if (user.isVerified()) {
      return GlobalMessageDto.builder().message("Email is already verified").build();
    }
    tokenRepository.markAllTokensAsUsedForUser(user);
    log.info("Invalidated existing tokens for user {}", user.getEmail());
    return sendVerificationEmail(user);
  }

  @Override
  @Transactional
  public GlobalMessageDto verifyEmail(String tokenValue) {
    var tokenOpt = tokenRepository.findByToken(tokenValue);
    if (tokenOpt.isEmpty()) {
      log.warn("Invalid verification token attempted: {}", tokenValue);
      return GlobalMessageDto.builder().message("Invalid verification token").build();
    }
    EmailVerificationToken token = tokenOpt.get();
    if (!token.isValid()) {
      String reason = token.isUsed() ? "already used" : "expired";
      log.warn("Invalid token for user {}: {}", token.getUser().getEmail(), reason);
      return GlobalMessageDto.builder().message("Verification token is " + reason).build();
    }
    User user = token.getUser();
    user.setVerified(true);
    userRepository.save(user);
    token.setUsed(true);
    tokenRepository.save(token);
    log.info("Successfully verified email for user {}", user.getEmail());
    return GlobalMessageDto.builder().message("Email verified successfully").build();
  }

  /** Core method to generate token and send verification email */
  private GlobalMessageDto sendVerificationEmail(User user) {
    try {
      String tokenValue = UUID.randomUUID().toString();
      EmailVerificationToken token =
          EmailVerificationToken.builder()
              .token(tokenValue)
              .user(user)
              .expiresAt(LocalDateTime.now().plusMinutes(tokenExpiryMinutes))
              .build();
      tokenRepository.save(token);
      String verificationLink = baseUrl + "/user/verify-email?token=" + tokenValue;
      Map<String, Object> emailData = new HashMap<>();
      emailData.put(NAME, user.getFirstName());
      emailData.put(VERIFICATION_LINK, verificationLink);
      emailData.put(EXPIRY_MINUTES, tokenExpiryMinutes);
      NotificationRequest request =
          NotificationRequest.builder()
              .recipient(user.getEmail())
              .type(NotificationType.EMAIL)
              .templateType(TemplateType.EMAIL_VERIFICATION)
              .data(emailData)
              .build();
      notificationService.send(request);
      log.info("Verification email sent to {}", user.getEmail());
      return GlobalMessageDto.builder().message("Verification email sent successfully").build();
    } catch (Exception e) {
      log.error("Failed to send verification email to {}", user.getEmail(), e);
      return GlobalMessageDto.builder()
          .message("Failed to send verification email. Please try again later.")
          .build();
    }
  }
}
