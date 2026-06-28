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
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class PassDecryptor {
  private PassDecryptor() {}

  public PrivateKey getPrivateKey() {
    try (InputStream is = getClass().getResourceAsStream("/keys/private_key.pem")) {
      if (is == null) {
        throw new KeyLoadingException("Private key not found");
      }
      String privateKeyPEM =
          new String(is.readAllBytes(), StandardCharsets.UTF_8)
              .replace("-----BEGIN PRIVATE KEY-----", "")
              .replace("-----END PRIVATE KEY-----", "")
              .replaceAll("\\s+", "");
      byte[] keyBytes = Base64.getDecoder().decode(privateKeyPEM);
      PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(keyBytes);
      KeyFactory keyFactory = KeyFactory.getInstance("RSA");
      return keyFactory.generatePrivate(spec);
    } catch (Exception e) {
      throw new KeyLoadingException("Failed to load private key", e);
    }
  }

  public String decryptPassword(String encryptedPassword) {
    try {
      Cipher cipher = Cipher.getInstance("RSA/ECB/OAEPWithSHA-256AndMGF1Padding");
      OAEPParameterSpec oaepParams =
          new OAEPParameterSpec(
              "SHA-256", "MGF1", MGF1ParameterSpec.SHA256, PSource.PSpecified.DEFAULT);
      cipher.init(Cipher.DECRYPT_MODE, getPrivateKey(), oaepParams);
      byte[] decryptedBytes = cipher.doFinal(Base64.getDecoder().decode(encryptedPassword));
      return new String(decryptedBytes, StandardCharsets.UTF_8);
    } catch (Exception e) {
      log.error("Failed to decrypt password", e);
      throw new GenericApplicationException("Failed to decrypt password", 400);
    }
  }
}
