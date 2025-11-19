import { useTheme } from "@/context/theme-context";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

export interface IconButtonProps {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  onPress?: () => void;
  color?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  name,
  size = 24,
  onPress,
  color,
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Ionicons name={name} size={size} color={color || colors.text} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
  },
});
