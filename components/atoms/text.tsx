import { useTheme } from "@/context/theme-context";
import React from "react";
import {
  Text as RNText,
  TextProps as RNTextProps,
  StyleSheet,
} from "react-native";

export interface TextProps extends RNTextProps {
  variant?: "h1" | "h2" | "h3" | "body" | "caption" | "link";
  color?: string;
}

export const Text: React.FC<TextProps> = ({
  variant = "body",
  color,
  style,
  ...props
}) => {
  const { colors } = useTheme();

  const textColor = color || colors.text;

  return (
    <RNText
      style={[
        styles.base,
        variant === "h1" && styles.h1,
        variant === "h2" && styles.h2,
        variant === "h3" && styles.h3,
        variant === "body" && styles.body,
        variant === "caption" && styles.caption,
        variant === "link" && { color: colors.link },
        { color: textColor },
        style,
      ]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  base: {
    fontFamily: "system-ui",
  },
  h1: {
    fontSize: 32,
    fontWeight: "700",
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
  },
});
