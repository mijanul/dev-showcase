// Button Component - Atomic Design

import React from 'react';
import {
    ActivityIndicator,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const { theme } = useTheme();

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: theme.borderRadius.base,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    };

    // Size styles
    const sizeStyles: Record<string, ViewStyle> = {
      small: {
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.base,
      },
      medium: {
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
      },
      large: {
        paddingVertical: theme.spacing.base,
        paddingHorizontal: theme.spacing.xl,
      },
    };

    // Variant styles
    const variantStyles: Record<string, ViewStyle> = {
      primary: {
        backgroundColor: disabled ? theme.colors.textTertiary : theme.colors.primary,
      },
      secondary: {
        backgroundColor: disabled ? theme.colors.textTertiary : theme.colors.secondary,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: disabled ? theme.colors.border : theme.colors.primary,
      },
      ghost: {
        backgroundColor: 'transparent',
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...(fullWidth && { width: '100%' }),
      ...(disabled && { opacity: 0.6 }),
    };
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      ...theme.typography.styles.button,
      fontWeight: theme.typography.fontWeight.semibold,
    };

    const variantTextStyles: Record<string, TextStyle> = {
      primary: { color: theme.colors.textInverse },
      secondary: { color: theme.colors.textInverse },
      outline: { color: theme.colors.primary },
      ghost: { color: theme.colors.primary },
    };

    return {
      ...baseStyle,
      ...variantTextStyles[variant],
    };
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' || variant === 'secondary' ? theme.colors.textInverse : theme.colors.primary}
          size="small"
        />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};
