// Input Component - Atomic Design

import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useTheme } from "../../hooks/useTheme";
import { Icon } from "../Icon";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  showPasswordToggle?: boolean;
  leftIcon?: keyof typeof import("@expo/vector-icons").Ionicons.glyphMap;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  style,
  showPasswordToggle = false,
  secureTextEntry,
  leftIcon,
  ...textInputProps
}) => {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const focusScale = useSharedValue(1);
  const errorShake = useSharedValue(0);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: focusScale.value }, { translateX: errorShake.value }],
  }));

  const handleFocus = () => {
    setIsFocused(true);
    focusScale.value = withSpring(1.01, { damping: 15 });
  };

  const handleBlur = () => {
    setIsFocused(false);
    focusScale.value = withSpring(1, { damping: 15 });
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const actualSecureTextEntry = showPasswordToggle
    ? !isPasswordVisible
    : secureTextEntry;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text
          style={[
            styles.label,
            {
              color: isFocused
                ? theme.colors.primary
                : theme.colors.textSecondary,
              fontSize: theme.typography.fontSize.sm,
              marginBottom: theme.spacing.xs,
              fontWeight: "600",
            },
          ]}
        >
          {label}
        </Text>
      )}
      <Animated.View style={[styles.inputWrapper, animatedContainerStyle]}>
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            <Icon
              name={leftIcon}
              size={20}
              color={
                isFocused ? theme.colors.primary : theme.colors.textTertiary
              }
            />
          </View>
        )}
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.backgroundSecondary,
              borderColor: error
                ? theme.colors.error
                : isFocused
                ? theme.colors.primary
                : theme.colors.border,
              borderWidth: isFocused ? 2 : 1,
              borderRadius: theme.borderRadius.lg,
              paddingVertical: theme.spacing.md,
              paddingHorizontal: leftIcon ? theme.spacing.xl : theme.spacing.md,
              paddingRight: showPasswordToggle ? 48 : theme.spacing.md,
              fontSize: theme.typography.fontSize.base,
              color: theme.colors.text,
            },
            style,
          ]}
          placeholderTextColor={theme.colors.textTertiary}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={actualSecureTextEntry}
          {...textInputProps}
        />
        {showPasswordToggle && (
          <Pressable
            style={styles.passwordToggle}
            onPress={togglePasswordVisibility}
          >
            <Icon
              name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
              size={22}
              color={theme.colors.textSecondary}
            />
          </Pressable>
        )}
      </Animated.View>
      {error && (
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={14} color={theme.colors.error} />
          <Text
            style={[
              styles.error,
              {
                color: theme.colors.error,
                fontSize: theme.typography.fontSize.sm,
                marginLeft: 4,
              },
            ]}
          >
            {error}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontWeight: "500",
  },
  inputWrapper: {
    position: "relative",
    width: "100%",
  },
  input: {
    width: "100%",
  },
  leftIconContainer: {
    position: "absolute",
    left: 12,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    zIndex: 1,
  },
  passwordToggle: {
    position: "absolute",
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  error: {
    fontWeight: "400",
  },
});
