import { useTheme } from "@/context/theme-context";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { Text } from "./text";

export interface ButtonProps extends TouchableOpacityProps {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "small" | "medium" | "large";
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "medium",
  loading = false,
  disabled,
  children,
  style,
  ...props
}) => {
  const { colors } = useTheme();

  const getBackgroundColor = () => {
    if (disabled) return colors.border;
    switch (variant) {
      case "primary":
        return colors.primary;
      case "secondary":
        return colors.secondary;
      case "outline":
      case "ghost":
        return "transparent";
      default:
        return colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.placeholder;
    switch (variant) {
      case "primary":
      case "secondary":
        return "#ffffff";
      case "outline":
      case "ghost":
        return colors.primary;
      default:
        return "#ffffff";
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        size === "small" && styles.small,
        size === "medium" && styles.medium,
        size === "large" && styles.large,
        variant === "outline" && {
          borderWidth: 1,
          borderColor: colors.primary,
        },
        { backgroundColor: getBackgroundColor() },
        style,
      ]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text
          style={[
            styles.text,
            size === "small" && styles.smallText,
            size === "medium" && styles.mediumText,
            size === "large" && styles.largeText,
            { color: getTextColor() },
          ]}
        >
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  small: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    height: 36,
  },
  medium: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 48,
  },
  large: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    height: 56,
  },
  text: {
    fontWeight: "600",
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
});
