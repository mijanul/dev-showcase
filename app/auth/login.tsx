import { IconButton } from "@/components/atoms/icon-button";
import { Text } from "@/components/atoms/text";
import { AuthFooter } from "@/components/organisms/auth-footer";
import { AuthHeader } from "@/components/organisms/auth-header";
import { LoginForm, LoginFormData } from "@/components/organisms/login-form";
import { MAX_FAILED_ATTEMPTS, useAuth } from "@/context/auth-context";
import { useTheme } from "@/context/theme-context";
import { Alert } from "@/utils/alert";
import { biometricAuth } from "@/utils/biometric-auth";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function LoginScreen() {
  const router = useRouter();
  const { colors, theme, toggleTheme } = useTheme();
  const {
    login,
    loginWithDemo,
    isLockedOut,
    lockoutEndTime,
    failedAttempts,
    resetLockout,
  } = useAuth();
  const [remainingTime, setRemainingTime] = useState<string>("");
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricType, setBiometricType] = useState<string>("Biometric");
  const [biometricInfo, setBiometricInfo] = useState<{
    hasHardware: boolean;
    isEnrolled: boolean;
  }>({ hasHardware: false, isEnrolled: false });

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setIsKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setIsKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    checkBiometricStatus();
  }, []);

  const checkBiometricStatus = async () => {
    const info = await biometricAuth.isAvailable();
    setBiometricAvailable(info.isAvailable);
    setBiometricType(biometricAuth.getBiometricTypeName(info.biometricType));
    setBiometricInfo({
      hasHardware: info.biometricType !== "none",
      isEnrolled: info.isEnrolled,
    });

    if (info.isAvailable) {
      const enabled = await biometricAuth.isEnabled();
      setBiometricEnabled(enabled);
    }
  };

  useEffect(() => {
    if (isLockedOut && lockoutEndTime) {
      const interval = setInterval(() => {
        const remaining = lockoutEndTime - Date.now();
        if (remaining <= 0) {
          setRemainingTime("");
          clearInterval(interval);
          resetLockout();
        } else {
          const minutes = Math.floor(remaining / 60000);
          const seconds = Math.floor((remaining % 60000) / 1000);
          setRemainingTime(`${minutes}:${seconds.toString().padStart(2, "0")}`);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isLockedOut, lockoutEndTime, resetLockout]);

  const handleLogin = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);

      router.replace("/account");
      Toast.show({
        type: "success",
        text1: "Login Successful",
        text2: "Welcome back!",
        position: "top",
        visibilityTime: 3000,
      });
    } catch (error) {
      Alert.alert(
        "Login Failed",
        error instanceof Error
          ? error.message
          : "An error occurred during login",
        [{ text: "OK" }]
      );
    }
  };

  const handleSignupPress = () => {
    router.push("/auth/signup");
  };

  const handleForgotPassword = () => {
    Alert.alert(
      "Forgot Password",
      "Password reset functionality will be implemented soon. Please contact support for assistance.",
      [{ text: "OK" }]
    );
  };

  const handleDemoLogin = async () => {
    try {
      await loginWithDemo();

      router.replace("/account");
      Toast.show({
        type: "success",
        text1: "Demo Login Successful! 🎭",
        text2: "Welcome to the demo account! You can explore all features.",
        position: "top",
        visibilityTime: 3000,
      });
    } catch (error) {
      Alert.alert(
        "Demo Login Failed",
        error instanceof Error
          ? error.message
          : "An error occurred during demo login",
        [{ text: "OK" }]
      );
    }
  };

  const handleBiometricLogin = async () => {
    try {
      const success = await biometricAuth.authenticate(
        `Login with ${biometricType}`
      );

      if (success) {
        // Get stored credentials
        const credentials = await biometricAuth.getStoredCredentials();
        if (!credentials) {
          Alert.alert(
            "Error",
            "No saved credentials found. Please login with password and re-enable biometric login in Settings.",
            [{ text: "OK" }]
          );
          return;
        }

        // Login with stored credentials
        await login(credentials.email, credentials.password);

        router.replace("/account");
        Toast.show({
          type: "success",
          text1: "Login Successful",
          text2: `Authenticated with ${biometricType}`,
          position: "top",
          visibilityTime: 3000,
        });
      } else {
        Alert.alert(
          "Authentication Failed",
          `${biometricType} authentication was cancelled or failed.`,
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      Alert.alert(
        "Biometric Login Failed",
        error instanceof Error
          ? error.message
          : "An error occurred during biometric login",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <>
      <Stack.Screen
        options={{ title: "dev-showcase | Login", headerShown: false }}
      />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <AuthHeader />
        <View style={styles.header}>
          <IconButton
            name={theme === "dark" ? "sunny-outline" : "moon-outline"}
            onPress={toggleTheme}
            size={28}
          />
        </View>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={
            isKeyboardVisible || Platform.OS === "ios" ? "padding" : "height"
          }
          keyboardVerticalOffset={
            isKeyboardVisible ? (Platform.OS === "ios" ? 60 : 100) : 0
          }
          enabled
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View style={styles.formContainer}>
              {isLockedOut && remainingTime && (
                <View
                  style={[
                    styles.lockoutWrapper,
                    {
                      backgroundColor: colors.cardBackground,
                      borderColor: colors.error,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.lockoutIconContainer,
                      { backgroundColor: colors.error + "20" },
                    ]}
                  >
                    <Ionicons
                      name="lock-closed"
                      size={48}
                      color={colors.error}
                    />
                  </View>
                  <Text
                    style={[
                      styles.lockoutTitle,
                      { color: colors.error, marginTop: 24 },
                    ]}
                  >
                    Login Locked
                  </Text>
                  <Text
                    style={[
                      styles.lockoutMessage,
                      { color: colors.secondary, marginTop: 8 },
                    ]}
                  >
                    Too many failed login attempts
                  </Text>
                  <View
                    style={[
                      styles.timerContainer,
                      {
                        backgroundColor: colors.error + "15",
                        borderColor: colors.error + "40",
                        marginTop: 24,
                      },
                    ]}
                  >
                    <Ionicons
                      name="time-outline"
                      size={20}
                      color={colors.error}
                      style={styles.timerIcon}
                    />
                    <Text style={[styles.timerText, { color: colors.error }]}>
                      {remainingTime}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.lockoutSubtext,
                      { color: colors.secondary, marginTop: 16 },
                    ]}
                  >
                    Please wait before trying again
                  </Text>
                </View>
              )}

              {!isLockedOut && failedAttempts > 0 && (
                <View
                  style={[
                    styles.warningBanner,
                    { backgroundColor: colors.warning + "20" },
                  ]}
                >
                  <Text style={[styles.warningText, { color: colors.warning }]}>
                    ⚠️ {MAX_FAILED_ATTEMPTS - failedAttempts} attempt(s)
                    remaining
                  </Text>
                </View>
              )}

              <LoginForm
                onSubmit={handleLogin}
                onSignupPress={handleSignupPress}
                onForgotPasswordPress={handleForgotPassword}
                onDemoLogin={handleDemoLogin}
                onBiometricLogin={
                  biometricAvailable && biometricEnabled
                    ? handleBiometricLogin
                    : undefined
                }
                biometricType={biometricType}
                biometricAvailable={biometricAvailable}
                biometricEnabled={biometricEnabled}
                biometricHasHardware={biometricInfo.hasHardware}
                biometricIsEnrolled={biometricInfo.isEnrolled}
                onEnableBiometric={() => router.push("/account")}
                disabled={isLockedOut}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <AuthFooter />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 24,
  },
  formContainer: {
    position: "relative",
    padding: 16,
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  lockoutWrapper: {
    position: "absolute",
    top: 0,
    left: 16,
    right: 16,
    bottom: 0,
    padding: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 10,
  },
  lockoutIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  lockoutTitle: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },
  lockoutMessage: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "500",
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  timerIcon: {
    marginRight: 8,
  },
  timerText: {
    fontSize: 28,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  lockoutSubtext: {
    fontSize: 14,
    textAlign: "center",
    fontWeight: "400",
  },
  warningBanner: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  warningText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});
