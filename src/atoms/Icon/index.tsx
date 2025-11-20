// Icon Component - Atom

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, ViewStyle } from "react-native";
import { useTheme } from "../../hooks/useTheme";

interface IconProps {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color,
  onPress,
  style,
}) => {
  const { theme } = useTheme();
  const iconColor = color || theme.colors.text;

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} style={style} activeOpacity={0.7}>
        <Ionicons name={name} size={size} color={iconColor} />
      </TouchableOpacity>
    );
  }

  return <Ionicons name={name} size={size} color={iconColor} style={style} />;
};
