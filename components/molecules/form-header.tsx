import { useTheme } from "@/context/theme-context";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "../atoms";

export interface FormHeaderProps {
  title: string;
  subtitle?: string;
}

export const FormHeader: React.FC<FormHeaderProps> = ({ title, subtitle }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text variant="h1" style={[styles.title, { color: colors.text }]}>
        {title}
      </Text>
      {subtitle && (
        <Text
          variant="body"
          style={[styles.subtitle, { color: colors.secondary }]}
        >
          {subtitle}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
    alignItems: "center",
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
  },
});
