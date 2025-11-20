// AuthForm Component - Organism

import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { AnimatedLogo } from "../../atoms/AnimatedLogo";
import { Button } from "../../atoms/Button";
import { Text } from "../../atoms/Text";
import { useTheme } from "../../hooks/useTheme";
import { FormField } from "../../molecules/FormField";
import { PasswordStrengthIndicator } from "../../molecules/PasswordStrengthIndicator";

interface AuthFormProps {
  mode: "login" | "signup";
  onSubmit: (email: string, password: string) => Promise<void>;
  onToggleMode: () => void;
  isLoading?: boolean;
  error?: string | null;
}

interface FormData {
  email: string;
  password: string;
  confirmPassword?: string;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  mode,
  onSubmit,
  onToggleMode,
  isLoading = false,
  error,
}) => {
  const { theme } = useTheme();
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const password = watch("password");

  useEffect(() => {
    // Reset form when mode changes
    reset();
  }, [mode, reset]);

  const onFormSubmit = async (data: FormData) => {
    await onSubmit(data.email, data.password);
  };

  const validateEmail = (value: string | undefined) => {
    if (!value) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Invalid email address";
    return true;
  };

  const validatePassword = (value: string | undefined) => {
    if (!value) return "Password is required";
    if (value.length < 8) return "Password must be at least 8 characters";
    return true;
  };

  const validateConfirmPassword = (value: string | undefined) => {
    if (mode !== "signup") return true;
    if (!value) return "Please confirm your password";
    if (value !== password) return "Passwords do not match";
    return true;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.formContainer,
            {
              backgroundColor: theme.isDark
                ? "rgba(255, 255, 255, 0.05)"
                : "rgba(255, 255, 255, 0.85)",
              borderRadius: theme.borderRadius["2xl"],
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.1,
              shadowRadius: 20,
              elevation: 10,
            },
          ]}
        >
          {/* Animated Logo */}
          <Animated.View entering={FadeInDown.duration(600).springify()}>
            <AnimatedLogo size={120} />
          </Animated.View>

          {/* Title */}
          <Animated.View
            entering={FadeInUp.delay(200).duration(600).springify()}
          >
            <Text
              variant="h2"
              weight="bold"
              align="center"
              style={{ marginBottom: theme.spacing.xs }}
            >
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </Text>
            <Text
              variant="body"
              color="textSecondary"
              align="center"
              style={{ marginBottom: theme.spacing["2xl"] }}
            >
              {mode === "login"
                ? "Sign in to continue to your account"
                : "Sign up to get started with your tasks"}
            </Text>
          </Animated.View>

          {/* Error Message */}
          {error && (
            <Animated.View
              entering={FadeInDown.duration(400)}
              style={[
                styles.errorContainer,
                {
                  backgroundColor: theme.colors.error + "15",
                  borderColor: theme.colors.error,
                  borderWidth: 1,
                  borderRadius: theme.borderRadius.lg,
                  padding: theme.spacing.md,
                  marginBottom: theme.spacing.base,
                },
              ]}
            >
              <Text
                variant="bodySmall"
                color="error"
                style={{ fontWeight: "500" }}
              >
                {error}
              </Text>
            </Animated.View>
          )}

          {/* Email Field */}
          <Animated.View
            entering={FadeInUp.delay(400).duration(600).springify()}
          >
            <Controller
              control={control}
              name="email"
              rules={{ validate: validateEmail }}
              render={({ field: { onChange, onBlur, value } }) => (
                <FormField
                  label="Email Address"
                  value={value}
                  onChangeText={onChange}
                  placeholder="Enter your email"
                  error={errors.email?.message}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  leftIcon="mail-outline"
                />
              )}
            />
          </Animated.View>

          {/* Password Field */}
          <Animated.View
            entering={FadeInUp.delay(500).duration(600).springify()}
          >
            <Controller
              control={control}
              name="password"
              rules={{ validate: validatePassword }}
              render={({ field: { onChange, onBlur, value } }) => (
                <FormField
                  label="Password"
                  value={value}
                  onChangeText={onChange}
                  placeholder="Enter your password"
                  error={errors.password?.message}
                  showPasswordToggle
                  autoCapitalize="none"
                  leftIcon="lock-closed-outline"
                />
              )}
            />

            {/* Password Strength Indicator (Signup only) */}
            {mode === "signup" && password && (
              <PasswordStrengthIndicator password={password} />
            )}
          </Animated.View>

          {/* Confirm Password Field (Signup only) */}
          {mode === "signup" && (
            <Animated.View
              entering={FadeInUp.delay(600).duration(600).springify()}
            >
              <Controller
                control={control}
                name="confirmPassword"
                rules={{ validate: validateConfirmPassword }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormField
                    label="Confirm Password"
                    value={value || ""}
                    onChangeText={onChange}
                    placeholder="Confirm your password"
                    error={errors.confirmPassword?.message}
                    showPasswordToggle
                    autoCapitalize="none"
                    leftIcon="lock-closed-outline"
                  />
                )}
              />
            </Animated.View>
          )}

          {/* Submit Button */}
          <Animated.View
            entering={FadeInUp.delay(700).duration(600).springify()}
          >
            <Button
              title={mode === "login" ? "Login" : "Sign Up"}
              onPress={handleSubmit(onFormSubmit)}
              loading={isLoading}
              fullWidth
              style={{ marginTop: theme.spacing.lg }}
            />
          </Animated.View>

          {/* Toggle Mode */}
          <Animated.View
            entering={FadeInUp.delay(800).duration(600).springify()}
            style={styles.toggleContainer}
          >
            <Text variant="body" color="textSecondary">
              {mode === "login"
                ? "Don't have an account? "
                : "Already have an account? "}
            </Text>
            <Button
              title={mode === "login" ? "Sign Up" : "Login"}
              onPress={onToggleMode}
              variant="ghost"
              size="small"
            />
          </Animated.View>

          {/* Additional Info */}
          {mode === "login" && (
            <Animated.View
              entering={FadeInUp.delay(900).duration(600).springify()}
            >
              <Text
                variant="bodySmall"
                color="textTertiary"
                align="center"
                style={{ marginTop: theme.spacing.lg }}
              >
                By continuing, you agree to our Terms of Service and Privacy
                Policy
              </Text>
            </Animated.View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  formContainer: {
    padding: 24,
  },
  errorContainer: {
    marginBottom: 16,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
});
