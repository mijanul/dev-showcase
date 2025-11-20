// Checkbox Component - Atomic Design

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';

interface CheckboxProps {
  checked: boolean;
  onToggle: () => void;
  size?: number;
  disabled?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onToggle,
  size = 24,
  disabled = false,
}) => {
  const { theme } = useTheme();
  const scale = useSharedValue(checked ? 1 : 0);

  React.useEffect(() => {
    scale.value = withSpring(checked ? 1 : 0, {
      damping: 15,
      stiffness: 200,
    });
  }, [checked]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <TouchableOpacity
      onPress={onToggle}
      disabled={disabled}
      activeOpacity={0.7}
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: theme.borderRadius.sm,
          borderWidth: 2,
          borderColor: checked ? theme.colors.primary : theme.colors.border,
          backgroundColor: checked ? theme.colors.primary : 'transparent',
          opacity: disabled ? 0.5 : 1,
        },
      ]}
    >
      <Animated.View style={animatedStyle}>
        {checked && (
          <Ionicons
            name="checkmark"
            size={size * 0.7}
            color={theme.colors.textInverse}
          />
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
