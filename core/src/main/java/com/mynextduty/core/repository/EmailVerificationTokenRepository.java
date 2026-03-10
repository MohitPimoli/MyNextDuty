package com.mynextduty.core.repository;

import com.mynextduty.core.entity.EmailVerificationToken;
import com.mynextduty.core.entity.User;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface EmailVerificationTokenRepository
    extends JpaRepository<EmailVerificationToken, Long> {

  Optional<EmailVerificationToken> findByToken(String token);

  @Query(
      value = "SELECT * from email_verification_tokens WHERE user_id = (:userId) AND used = false",
      nativeQuery = true)
  Optional<EmailVerificationToken> findByUserId(@Param("userId") Long userId);

  List<EmailVerificationToken> findByUserAndUsedFalse(User user);

  @Modifying
  @Query(
      "UPDATE EmailVerificationToken t SET t.used = true WHERE t.user = :user AND t.used = false")
  void markAllTokensAsUsedForUser(@Param("user") User user);

  @Modifying
  @Query("DELETE FROM EmailVerificationToken t WHERE t.expiresAt < :now")
  void deleteExpiredTokens(@Param("now") LocalDateTime now);
}
