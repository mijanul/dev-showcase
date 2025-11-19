// Web fallback - biometric auth not supported
export interface BiometricInfo {
  isAvailable: boolean;
  biometricType: "fingerprint" | "face" | "iris" | "none";
  isEnrolled: boolean;
}

export const biometricAuth = {
  async isAvailable(): Promise<BiometricInfo> {
    return {
      isAvailable: false,
      biometricType: "none",
      isEnrolled: false,
    };
  },

  async authenticate(): Promise<boolean> {
    console.warn("Biometric authentication is not supported on web");
    return false;
  },

  async isEnabled(): Promise<boolean> {
    return false;
  },

  async enable(): Promise<boolean> {
    console.warn("Biometric authentication is not supported on web");
    return false;
  },

  async disable(): Promise<void> {
    console.warn("Biometric authentication is not supported on web");
  },

  getBiometricTypeName(): string {
    return "Biometric";
  },
};
