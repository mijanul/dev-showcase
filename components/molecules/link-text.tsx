import { useTheme } from "@/context/theme-context";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "../atoms";

export interface LinkTextProps {
  text: string;
  linkText: string;
  onPress: () => void;
  disabled?: boolean;
}

export const LinkText: React.FC<LinkTextProps> = ({
  text,
  linkText,
  onPress,
  disabled = false,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text variant="body" style={{ color: colors.text }}>
        {text}{" "}
      </Text>
      <TouchableOpacity onPress={onPress} disabled={disabled}>
        <Text
          variant="link"
          style={{
            color: disabled ? colors.secondary : colors.link,
            fontWeight: "600",
            opacity: disabled ? 0.5 : 1,
          }}
        >
          {linkText}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
