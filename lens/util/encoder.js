import CryptoJS from "crypto-js";

/**
 * Password encoder utility for RSA encryption
 * Matches backend RSA/ECB/OAEPWithSHA-256AndMGF1Padding decryption
 */
class PasswordEncoder {
  constructor() {
    this.publicKey = null;
  }

  /**
   * Import RSA public key from PEM format
   * @param {string} pemKey - PEM formatted public key
   * @returns {Promise<CryptoKey>} - Imported public key
   */
  async importPublicKey(pemKey) {
    try {
      // Clean up the PEM key
      const pemHeader = "-----BEGIN PUBLIC KEY-----";
      const pemFooter = "-----END PUBLIC KEY-----";
      const pemContents = pemKey.replace(pemHeader, "").replace(pemFooter, "").replace(/\s+/g, "");

      // Convert base64 to ArrayBuffer
      const binaryDer = Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0));

      // Import the key with RSA-OAEP and SHA-256
      return await window.crypto.subtle.importKey(
        "spki",
        binaryDer,
        {
          name: "RSA-OAEP",
          hash: "SHA-256",
        },
        false,
        ["encrypt"]
      );
    } catch (error) {
      console.error("Failed to import public key:", error);
      throw new Error("Invalid public key format");
    }
  }

  /**
   * Get or initialize the public key
   * @returns {Promise<CryptoKey>} - The public key
   */
  async getPublicKey() {
    if (this.publicKey) {
      return this.publicKey;
    }

    const publicKeyPem = process.env.NEXT_PUBLIC_RSA_KEY;

    if (!publicKeyPem) {
      throw new Error("NEXT_PUBLIC_RSA_KEY not found in environment variables");
    }

    this.publicKey = await this.importPublicKey(publicKeyPem);
    return this.publicKey;
  }

  /**
   * Encrypt password using RSA-OAEP with SHA-256
   * This matches the backend's RSA/ECB/OAEPWithSHA-256AndMGF1Padding decryption
   * @param {string} password - Plain text password to encrypt
   * @returns {Promise<string>} - Base64 encoded encrypted password
   */
  async encryptPassword(password) {
    try {
      const publicKey = await this.getPublicKey();

      // Convert password to UTF-8 bytes
      const passwordBytes = new TextEncoder().encode(password);

      // Encrypt using RSA-OAEP with SHA-256
      // This corresponds to RSA/ECB/OAEPWithSHA-256AndMGF1Padding in Java
      const encryptedBuffer = await window.crypto.subtle.encrypt(
        {
          name: "RSA-OAEP",
          hash: "SHA-256",
        },
        publicKey,
        passwordBytes
      );

      // Convert to base64 (matching Java's Base64.getDecoder().decode())
      const encryptedArray = new Uint8Array(encryptedBuffer);
      const encryptedBase64 = btoa(String.fromCharCode(...encryptedArray));

      return encryptedBase64;
    } catch (error) {
      console.error("Password encryption failed:", error);
      throw new Error(`Failed to encrypt password: ${error.message}`);
    }
  }

  /**
   * Check if encryption is available
   * @returns {boolean} - True if encryption is available
   */
  isEncryptionAvailable() {
    return !!(process.env.NEXT_PUBLIC_RSA_KEY && window.crypto && window.crypto.subtle);
  }

  /**
   * Validate that the public key is properly configured
   * @returns {Promise<boolean>} - True if public key is valid
   */
  async validatePublicKey() {
    try {
      await this.getPublicKey();
      return true;
    } catch (error) {
      console.error("Public key validation failed:", error);
      return false;
    }
  }
}

// Create singleton instance
const passwordEncoder = new PasswordEncoder();

export default passwordEncoder;

// Named exports for convenience
export const encryptPassword = (password) => passwordEncoder.encryptPassword(password);
export const isEncryptionAvailable = () => passwordEncoder.isEncryptionAvailable();
