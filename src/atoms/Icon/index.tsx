// Icon Component - Atom

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TextStyle, TouchableOpacity, ViewStyle } from "react-native";
import { useTheme } from "../../hooks/useTheme";

interface IconProps {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
  onPress?: () => void;
  style?: TextStyle;
  containerStyle?: ViewStyle;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color,
  onPress,
  style,
  containerStyle,
}) => {
  const { theme } = useTheme();
  const iconColor = color || theme.colors.text;

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={containerStyle}
        activeOpacity={0.7}
      >
        <Ionicons name={name} size={size} color={iconColor} style={style} />
      </TouchableOpacity>
    );
  }

  return <Ionicons name={name} size={size} color={iconColor} style={style} />;
};
