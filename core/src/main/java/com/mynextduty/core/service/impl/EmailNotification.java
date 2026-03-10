package com.mynextduty.core.service.impl;

import com.mynextduty.core.dto.NotificationRequest;
import com.mynextduty.core.enums.TemplateType;
import com.mynextduty.core.service.NotificationChannel;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import static com.mynextduty.core.utils.Constants.NOTIFICATION;
import static com.mynextduty.core.utils.Constants.UTF;
import static com.mynextduty.core.utils.Constants.VERIFY_EMAIL_ADDRESS;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailNotification implements NotificationChannel {

  private final TemplateEngine templateEngine;
  private final JavaMailSender mailSender;

  @Override
  public void send(NotificationRequest request) {
    Context context = new Context();
    context.setVariables(request.getData());
    String body = templateEngine.process(request.getTemplateType().getTemplatePath(), context);
    sendEmail(request.getRecipient(), getSubject(request.getTemplateType()), body);
  }

  private String getSubject(TemplateType type) {
    return switch (type) {
      case EMAIL_VERIFICATION -> VERIFY_EMAIL_ADDRESS;
      default -> NOTIFICATION;
    };
  }

  private void sendEmail(String to, String subject, String body) {
    try {
      MimeMessage message = mailSender.createMimeMessage();
      MimeMessageHelper helper = new MimeMessageHelper(message, true, UTF);
      helper.setTo(to);
      helper.setSubject(subject);
      helper.setText(body, true);
      mailSender.send(message);
      log.debug("Email sent to {}", to);
    } catch (Exception e) {
      log.error("Failed to send email to {}", to, e);
    }
  }
}
