import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

/**
 * Web-compatible secure storage wrapper
 *
 * Mobile (iOS/Android): Uses native SecureStore (Keychain/Keystore)
 * Web: Uses localStorage with Base64 obfuscation
 *
 * PRODUCTION NOTE: For web, consider using:
 * - crypto-js for AES encryption
 * - tweetnacl for cryptographic operations
 * - Web Crypto API for modern browsers
 */
class SecureStorage {
  private isWeb = Platform.OS === "web";
  // Simple salt for web obfuscation (use proper secret management in production)
  private readonly salt = "app_secure_salt_v1";

  async getItemAsync(key: string): Promise<string | null> {
    try {
      if (this.isWeb) {
        // Use localStorage for web with obfuscation
        if (typeof window === "undefined") return null;

        const encrypted = localStorage.getItem(this.getWebKey(key));
        if (!encrypted) return null;

        return this.decrypt(encrypted);
      }
      // Native SecureStore for iOS/Android
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return null;
    }
  }

  async setItemAsync(key: string, value: string): Promise<void> {
    try {
      if (this.isWeb) {
        if (typeof window === "undefined") {
          throw new Error("localStorage not available");
        }

        // Encrypt before storing in localStorage
        const encrypted = this.encrypt(value);
        localStorage.setItem(this.getWebKey(key), encrypted);
        return;
      }
      // Native SecureStore for iOS/Android
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
      throw error;
    }
  }

  async deleteItemAsync(key: string): Promise<void> {
    try {
      if (this.isWeb) {
        if (typeof window === "undefined") return;
        localStorage.removeItem(this.getWebKey(key));
        return;
      }
      // Native SecureStore for iOS/Android
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error(`Error deleting item ${key}:`, error);
      throw error;
    }
  }

  /**
   * Get namespaced key for web storage
   * Prevents conflicts with other apps using localStorage
   */
  private getWebKey(key: string): string {
    return `secure_${key}`;
  }

  /**
   * Simple encryption for web (Base64 + XOR with salt)
   *
   * PRODUCTION WARNING: This is basic obfuscation, not cryptographic security!
   * For production, use:
   *
   * Option 1 - crypto-js:
   *   npm install crypto-js
   *   import CryptoJS from 'crypto-js';
   *   return CryptoJS.AES.encrypt(text, secretKey).toString();
   *
   * Option 2 - Web Crypto API:
   *   const key = await crypto.subtle.generateKey(...);
   *   const encrypted = await crypto.subtle.encrypt(...);
   *
   * Option 3 - tweetnacl:
   *   npm install tweetnacl tweetnacl-util
   *   Use secretbox for authenticated encryption
   */
  private encrypt(text: string): string {
    if (typeof window === "undefined" || !window.btoa) {
      return text;
    }

    try {
      // XOR with salt for basic obfuscation
      const xored = this.xorWithSalt(text);
      // Base64 encode
      return window.btoa(unescape(encodeURIComponent(xored)));
    } catch {
      return text;
    }
  }

  /**
   * Simple decryption for web
   */
  private decrypt(encrypted: string): string {
    if (typeof window === "undefined" || !window.atob) {
      return encrypted;
    }

    try {
      // Base64 decode
      const decoded = decodeURIComponent(escape(window.atob(encrypted)));
      // XOR with salt to reverse obfuscation
      return this.xorWithSalt(decoded);
    } catch {
      return encrypted;
    }
  }

  /**
   * XOR operation with salt for basic obfuscation
   */
  private xorWithSalt(text: string): string {
    let result = "";
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const saltCharCode = this.salt.charCodeAt(i % this.salt.length);
      result += String.fromCharCode(charCode ^ saltCharCode);
    }
    return result;
  }
}

export const secureStorage = new SecureStorage();
