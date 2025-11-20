// Input Component - Atomic Design

import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    View,
    ViewStyle,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  style,
  ...textInputProps
}) => {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text
          style={[
            styles.label,
            {
              color: theme.colors.textSecondary,
              fontSize: theme.typography.fontSize.sm,
              marginBottom: theme.spacing.xs,
            },
          ]}
        >
          {label}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.backgroundSecondary,
            borderColor: error
              ? theme.colors.error
              : isFocused
              ? theme.colors.primary
              : theme.colors.border,
            borderWidth: 1,
            borderRadius: theme.borderRadius.base,
            padding: theme.spacing.md,
            fontSize: theme.typography.fontSize.base,
            color: theme.colors.text,
          },
          style,
        ]}
        placeholderTextColor={theme.colors.textTertiary}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...textInputProps}
      />
      {error && (
        <Text
          style={[
            styles.error,
            {
              color: theme.colors.error,
              fontSize: theme.typography.fontSize.sm,
              marginTop: theme.spacing.xs,
            },
          ]}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontWeight: '500',
  },
  input: {
    width: '100%',
  },
  error: {
    fontWeight: '400',
  },
});
