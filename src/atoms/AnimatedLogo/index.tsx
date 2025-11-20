// AnimatedLogo Component - Atom

import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';
import { Text } from '../Text';

interface AnimatedLogoProps {
  size?: number;
}

export const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ size = 100 }) => {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Initial fade in
    opacity.value = withTiming(1, { duration: 800 });

    // Pulse animation
    scale.value = withRepeat(
      withSequence(
        withSpring(1.1, { damping: 2, stiffness: 80 }),
        withSpring(1, { damping: 2, stiffness: 80 })
      ),
      -1,
      false
    );

    // Subtle rotation
    rotate.value = withRepeat(
      withSequence(
        withTiming(5, { duration: 2000 }),
        withTiming(-5, { duration: 2000 }),
        withTiming(0, { duration: 2000 })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotate.value}deg` }],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, animatedStyle]}>
        <View
          style={[
            styles.outerCircle,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: theme.colors.primary + '20',
              borderColor: theme.colors.primary,
            },
          ]}
        >
          <View
            style={[
              styles.innerCircle,
              {
                width: size * 0.7,
                height: size * 0.7,
                borderRadius: (size * 0.7) / 2,
                backgroundColor: theme.colors.primary,
              },
            ]}
          >
            <Text
              variant="h1"
              weight="bold"
              style={{ color: '#FFFFFF', fontSize: size * 0.35 }}
            >
              M
            </Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
  },
  innerCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
