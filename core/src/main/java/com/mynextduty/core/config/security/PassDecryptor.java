package com.mynextduty.core.config.security;

import com.mynextduty.core.exception.GenericApplicationException;
import com.mynextduty.core.exception.KeyLoadingException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.spec.MGF1ParameterSpec;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.Base64;
import javax.crypto.Cipher;
import javax.crypto.spec.OAEPParameterSpec;
import javax.crypto.spec.PSource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class PassDecryptor {
  private PassDecryptor() {}

  public PrivateKey getPrivateKey() {
    try (InputStream is = getClass().getResourceAsStream("/keys/private_key.pem")) {
      if (is == null) {
        throw new KeyLoadingException("Private key not found");
      }
      return KeyFactory.getInstance("RSA")
          .generatePrivate(
              new PKCS8EncodedKeySpec(
                  Base64.getDecoder()
                      .decode(
                          new String(is.readAllBytes(), StandardCharsets.UTF_8)
                              .replace("-----BEGIN PRIVATE KEY-----", "")
                              .replace("-----END PRIVATE KEY-----", "")
                              .replaceAll("\\s+", ""))));
    } catch (Exception e) {
      log.error("Failed to load private key, Error: {}", e.getMessage(), e);
      throw new KeyLoadingException("Failed to load private key", e);
    }
  }

  public String decryptPassword(String encryptedPassword) {
    try {
      Cipher cipher = Cipher.getInstance("RSA/ECB/OAEPWithSHA-256AndMGF1Padding");
      cipher.init(
          Cipher.DECRYPT_MODE,
          getPrivateKey(),
          new OAEPParameterSpec(
              "SHA-256", "MGF1", MGF1ParameterSpec.SHA256, PSource.PSpecified.DEFAULT));
      return new String(
          cipher.doFinal(Base64.getDecoder().decode(encryptedPassword)), StandardCharsets.UTF_8);
    } catch (Exception e) {
      log.error("Failed to decrypt password, Error: {}", e.getMessage(), e);
      throw new GenericApplicationException("Failed to decrypt password", 400);
    }
  }
}
