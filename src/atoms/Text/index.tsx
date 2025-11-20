// Text Component - Atomic Design

import React from 'react';
import { Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface TextProps extends RNTextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'bodySmall' | 'caption';
  color?: 'primary' | 'secondary' | 'text' | 'textSecondary' | 'textTertiary' | 'textInverse' | 'error' | 'success';
  align?: 'left' | 'center' | 'right';
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
}

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  color = 'text',
  align = 'left',
  weight,
  style,
  children,
  ...props
}) => {
  const { theme } = useTheme();

  const getTextStyle = (): TextStyle => {
    const variantStyle = theme.typography.styles[variant];
    
    const colorMap: Record<string, string> = {
      primary: theme.colors.primary,
      secondary: theme.colors.secondary,
      text: theme.colors.text,
      textSecondary: theme.colors.textSecondary,
      textTertiary: theme.colors.textTertiary,
      textInverse: theme.colors.textInverse,
      error: theme.colors.error,
      success: theme.colors.success,
    };

    return {
      ...variantStyle,
      color: colorMap[color],
      textAlign: align,
      ...(weight && { fontWeight: theme.typography.fontWeight[weight] }),
    };
  };

  return (
    <RNText style={[getTextStyle(), style]} {...props}>
      {children}
    </RNText>
  );
};
