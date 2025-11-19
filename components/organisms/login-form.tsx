import { useTheme } from "@/context/theme-context";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "../atoms/button";
import { Card } from "../atoms/card";
import { Text } from "../atoms/text";
import { FormHeader } from "../molecules/form-header";
import { FormInput } from "../molecules/form-input";
import { LinkText } from "../molecules/link-text";
import { PasswordInput } from "../molecules/password-input";

export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void | Promise<void>;
  onSignupPress: () => void;
  onForgotPasswordPress?: () => void;
  onDemoLogin?: () => void | Promise<void>;
  onBiometricLogin?: () => void | Promise<void>;
  biometricType?: string;
  biometricAvailable?: boolean;
  biometricEnabled?: boolean;
  biometricHasHardware?: boolean;
  biometricIsEnrolled?: boolean;
  onEnableBiometric?: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  onSignupPress,
  onForgotPasswordPress,
  onDemoLogin,
  onBiometricLogin,
  biometricType = "Biometric",
  biometricAvailable = false,
  biometricEnabled = false,
  biometricHasHardware = false,
  biometricIsEnrolled = false,
  onEnableBiometric,
  loading = false,
  disabled = false,
}) => {
  const { control, handleSubmit } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { colors } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [isBiometricLoading, setIsBiometricLoading] = useState(false);

  const handleFormSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async () => {
    if (!onDemoLogin) return;
    setIsDemoLoading(true);
    try {
      await onDemoLogin();
    } finally {
      setIsDemoLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    if (!onBiometricLogin) return;
    setIsBiometricLoading(true);
    try {
      await onBiometricLogin();
    } finally {
      setIsBiometricLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Card style={styles.card}>
        <FormHeader
          title="Welcome Back"
          subtitle="Sign in to continue to your account"
        />

        <View style={styles.form}>
          <FormInput
            name="email"
            control={control}
            label="Email"
            placeholder="Enter your email"
            keyboardType="email-address"
            editable={!disabled}
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            }}
          />

          <Controller
            name="password"
            control={control}
            rules={{
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                value={value}
                onChangeText={onChange}
                error={error?.message}
                editable={!disabled}
              />
            )}
          />

          {onForgotPasswordPress && (
            <View style={styles.passwordActions}>
              <TouchableOpacity
                onPress={onForgotPasswordPress}
                disabled={disabled}
              >
                <Text
                  style={[
                    styles.forgotPassword,
                    { color: disabled ? colors.secondary : colors.link },
                  ]}
                >
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <Button
            variant="primary"
            size="large"
            onPress={handleSubmit(handleFormSubmit)}
            loading={isSubmitting || loading}
            disabled={disabled}
            style={styles.submitButton}
          >
            Sign In
          </Button>

          {biometricAvailable && !biometricEnabled && onEnableBiometric && (
            <TouchableOpacity
              onPress={onEnableBiometric}
              disabled={disabled}
              style={[
                styles.biometricInfoBanner,
                {
                  backgroundColor: colors.primary + "15",
                  borderColor: colors.primary + "40",
                },
              ]}
            >
              <View style={styles.biometricInfoContent}>
                <Text style={[styles.biometricInfoIcon]}>ℹ️</Text>
                <View style={styles.biometricInfoText}>
                  <Text
                    style={[
                      styles.biometricInfoTitle,
                      { color: colors.primary },
                    ]}
                  >
                    {biometricType} Available
                  </Text>
                  <Text
                    style={[
                      styles.biometricInfoSubtitle,
                      { color: colors.secondary },
                    ]}
                  >
                    After logging in with your email and password, you can
                    enable {biometricType.toLowerCase()} authentication in
                    Account Settings for faster login next time.
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={colors.primary}
                />
              </View>
            </TouchableOpacity>
          )}

          {biometricHasHardware &&
            !biometricIsEnrolled &&
            Platform.OS !== "web" && (
              <View
                style={[
                  styles.biometricInfoBanner,
                  {
                    backgroundColor: colors.warning + "15",
                    borderColor: colors.warning + "40",
                  },
                ]}
              >
                <View style={styles.biometricInfoContent}>
                  <Text style={[styles.biometricInfoIcon]}>⚠️</Text>
                  <View style={styles.biometricInfoText}>
                    <Text
                      style={[
                        styles.biometricInfoTitle,
                        { color: colors.warning },
                      ]}
                    >
                      Biometric Not Set Up
                    </Text>
                    <Text
                      style={[
                        styles.biometricInfoSubtitle,
                        { color: colors.secondary },
                      ]}
                    >
                      Set up biometric authentication in your device settings to
                      enable quick login
                    </Text>
                  </View>
                </View>
              </View>
            )}

          {onBiometricLogin && (
            <>
              <View style={styles.divider}>
                <View
                  style={[
                    styles.dividerLine,
                    { backgroundColor: colors.border },
                  ]}
                />
                <Text style={[styles.dividerText, { color: colors.secondary }]}>
                  OR
                </Text>
                <View
                  style={[
                    styles.dividerLine,
                    { backgroundColor: colors.border },
                  ]}
                />
              </View>

              <Button
                variant="secondary"
                size="large"
                onPress={handleBiometricLogin}
                loading={isBiometricLoading}
                disabled={disabled || isSubmitting || loading}
                style={styles.biometricButton}
              >
                {biometricType === "Face ID" ? "👤" : "👆"} Biometric Login
              </Button>
            </>
          )}

          {onDemoLogin && (
            <>
              <View style={styles.divider}>
                <View
                  style={[
                    styles.dividerLine,
                    { backgroundColor: colors.border },
                  ]}
                />
                <Text style={[styles.dividerText, { color: colors.secondary }]}>
                  OR
                </Text>
                <View
                  style={[
                    styles.dividerLine,
                    { backgroundColor: colors.border },
                  ]}
                />
              </View>

              <Button
                variant="secondary"
                size="large"
                onPress={handleDemoLogin}
                loading={isDemoLoading}
                disabled={disabled || isSubmitting || loading}
                style={styles.demoButton}
              >
                🎭 Explore as Demo User
              </Button>
            </>
          )}

          <View style={styles.linkContainer}>
            <LinkText
              text="Don't have an account?"
              linkText="Sign Up"
              onPress={onSignupPress}
              disabled={disabled}
            />
          </View>
        </View>
      </Card>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  form: {
    width: "100%",
  },
  passwordActions: {
    alignItems: "flex-end",
    marginBottom: 16,
  },
  forgotPassword: {
    fontSize: 14,
    fontWeight: "600",
  },
  submitButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  biometricButton: {
    marginBottom: 8,
  },
  biometricInfoBanner: {
    marginTop: 12,
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  biometricInfoContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  biometricInfoIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  biometricInfoText: {
    flex: 1,
  },
  biometricInfoTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  biometricInfoSubtitle: {
    fontSize: 12,
    lineHeight: 16,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 14,
    fontWeight: "500",
  },
  demoButton: {
    marginBottom: 16,
  },
  linkContainer: {
    marginTop: 8,
  },
});
