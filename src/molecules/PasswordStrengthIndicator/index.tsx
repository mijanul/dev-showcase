// PasswordStrengthIndicator Component - Molecule

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '../../atoms/Text';
import { useTheme } from '../../hooks/useTheme';

interface PasswordStrengthIndicatorProps {
  password: string;
}

type StrengthLevel = 'weak' | 'medium' | 'strong';

interface StrengthResult {
  level: StrengthLevel;
  score: number;
  suggestions: string[];
}

const calculatePasswordStrength = (password: string): StrengthResult => {
  let score = 0;
  const suggestions: string[] = [];

  if (!password) {
    return { level: 'weak', score: 0, suggestions: ['Enter a password'] };
  }

  // Length check
  if (password.length >= 8) {
    score += 25;
  } else {
    suggestions.push('Use at least 8 characters');
  }

  if (password.length >= 12) {
    score += 10;
  }

  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score += 20;
  } else {
    suggestions.push('Add uppercase letters');
  }

  // Lowercase check
  if (/[a-z]/.test(password)) {
    score += 20;
  } else {
    suggestions.push('Add lowercase letters');
  }

  // Number check
  if (/\d/.test(password)) {
    score += 15;
  } else {
    suggestions.push('Add numbers');
  }

  // Special character check
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    score += 15;
  } else {
    suggestions.push('Add special characters');
  }

  // Determine level
  let level: StrengthLevel = 'weak';
  if (score >= 80) {
    level = 'strong';
  } else if (score >= 50) {
    level = 'medium';
  }

  return { level, score, suggestions };
};

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
}) => {
  const { theme } = useTheme();
  const { level, score, suggestions } = calculatePasswordStrength(password);

  const getColor = () => {
    switch (level) {
      case 'strong':
        return '#10B981'; // Green
      case 'medium':
        return '#F59E0B'; // Orange
      case 'weak':
      default:
        return '#EF4444'; // Red
    }
  };

  const getStrengthText = () => {
    switch (level) {
      case 'strong':
        return 'Strong password';
      case 'medium':
        return 'Medium strength';
      case 'weak':
      default:
        return 'Weak password';
    }
  };

  if (!password) return null;

  const color = getColor();

  return (
    <View style={styles.container}>
      {/* Strength bars */}
      <View style={styles.barsContainer}>
        {[1, 2, 3, 4].map((bar) => (
          <View
            key={bar}
            style={[
              styles.bar,
              {
                backgroundColor:
                  score >= bar * 25
                    ? color
                    : theme.colors.border,
              },
            ]}
          />
        ))}
      </View>

      {/* Strength text */}
      <View style={styles.textContainer}>
        <Text variant="bodySmall" style={{ color }}>
          {getStrengthText()}
        </Text>
      </View>

      {/* Suggestions */}
      {suggestions.length > 0 && level !== 'strong' && (
        <View style={styles.suggestionsContainer}>
          {suggestions.slice(0, 2).map((suggestion, index) => (
            <Text
              key={index}
              variant="bodySmall"
              color="textSecondary"
              style={styles.suggestion}
            >
              • {suggestion}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: 8,
  },
  barsContainer: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  bar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  textContainer: {
    marginBottom: 4,
  },
  suggestionsContainer: {
    marginTop: 4,
  },
  suggestion: {
    marginTop: 2,
  },
});
