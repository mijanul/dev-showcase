import * as LocalAuthentication from "expo-local-authentication";
import { Platform } from "react-native";
import { secureStorage } from "./secure-storage";

const BIOMETRIC_ENABLED_KEY = "biometric_auth_enabled";
const BIOMETRIC_CREDENTIALS_KEY = "biometric_credentials";

export interface BiometricInfo {
  isAvailable: boolean;
  biometricType: "fingerprint" | "face" | "iris" | "none";
  isEnrolled: boolean;
}

export const biometricAuth = {
  /**
   * Check if biometric authentication is available on the device
   */
  async isAvailable(): Promise<BiometricInfo> {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      const supportedTypes =
        await LocalAuthentication.supportedAuthenticationTypesAsync();

      let biometricType: "fingerprint" | "face" | "iris" | "none" = "none";

      if (
        supportedTypes.includes(
          LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
        )
      ) {
        biometricType = "face";
      } else if (
        supportedTypes.includes(
          LocalAuthentication.AuthenticationType.FINGERPRINT
        )
      ) {
        biometricType = "fingerprint";
      } else if (
        supportedTypes.includes(LocalAuthentication.AuthenticationType.IRIS)
      ) {
        biometricType = "iris";
      }

      return {
        isAvailable: hasHardware && isEnrolled,
        biometricType,
        isEnrolled,
      };
    } catch (error) {
      console.error("Error checking biometric availability:", error);
      return {
        isAvailable: false,
        biometricType: "none",
        isEnrolled: false,
      };
    }
  },

  /**
   * Authenticate using biometrics
   */
  async authenticate(
    promptMessage: string = "Authenticate to continue"
  ): Promise<boolean> {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        fallbackLabel: "Use passcode",
        disableDeviceFallback: false,
      });

      return result.success;
    } catch (error) {
      console.error("Biometric authentication error:", error);
      return false;
    }
  },

  /**
   * Check if biometric login is enabled by user
   */
  async isEnabled(): Promise<boolean> {
    try {
      const enabled = await secureStorage.getItemAsync(BIOMETRIC_ENABLED_KEY);
      return enabled === "true";
    } catch (error) {
      console.error("Error checking biometric enabled status:", error);
      return false;
    }
  },

  /**
   * Enable biometric login and store credentials
   */
  async enable(email: string, password: string): Promise<boolean> {
    try {
      // First verify the user can authenticate with biometric
      const canAuth = await this.authenticate(
        "Verify your identity to enable biometric login"
      );

      if (!canAuth) {
        return false;
      }

      // Store credentials securely
      const credentials = JSON.stringify({ email, password });
      await Promise.all([
        secureStorage.setItemAsync(BIOMETRIC_ENABLED_KEY, "true"),
        secureStorage.setItemAsync(BIOMETRIC_CREDENTIALS_KEY, credentials),
      ]);

      return true;
    } catch (error) {
      console.error("Error enabling biometric auth:", error);
      return false;
    }
  },

  /**
   * Disable biometric login and remove credentials
   */
  async disable(): Promise<void> {
    try {
      await Promise.all([
        secureStorage.deleteItemAsync(BIOMETRIC_ENABLED_KEY),
        secureStorage.deleteItemAsync(BIOMETRIC_CREDENTIALS_KEY),
      ]);
    } catch (error) {
      console.error("Error disabling biometric auth:", error);
    }
  },

  /**
   * Get stored credentials after biometric authentication
   */
  async getStoredCredentials(): Promise<{
    email: string;
    password: string;
  } | null> {
    try {
      const credentialsStr = await secureStorage.getItemAsync(
        BIOMETRIC_CREDENTIALS_KEY
      );
      if (!credentialsStr) {
        return null;
      }
      return JSON.parse(credentialsStr);
    } catch (error) {
      console.error("Error retrieving stored credentials:", error);
      return null;
    }
  },

  /**
   * Get a user-friendly name for the biometric type
   */
  getBiometricTypeName(type: string): string {
    switch (type) {
      case "face":
        return Platform.OS === "ios" ? "Face ID" : "Face Recognition";
      case "fingerprint":
        return Platform.OS === "ios" ? "Touch ID" : "Fingerprint";
      case "iris":
        return "Iris Recognition";
      default:
        return "Biometric";
    }
  },
};
