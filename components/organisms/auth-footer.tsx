import { useTheme } from "@/context/theme-context";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "../atoms/text";

export const AuthFooter: React.FC = () => {
  const { colors } = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.cardBackground,
          borderTopColor: colors.border,
        },
      ]}
    >
      <Text style={[styles.copyrightText, { color: colors.secondary }]}>
        © {currentYear} Dev Showcase. All rights reserved.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: "center",
    borderTopWidth: 1,
  },
  copyrightText: {
    fontSize: 12,
    textAlign: "center",
  },
});
