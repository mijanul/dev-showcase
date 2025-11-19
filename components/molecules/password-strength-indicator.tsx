import { useTheme } from "@/context/theme-context";
import { validatePasswordStrength } from "@/utils/validation";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "../atoms/text";

export interface PasswordStrengthIndicatorProps {
  password: string;
  showFeedback?: boolean;
}

export const PasswordStrengthIndicator: React.FC<
  PasswordStrengthIndicatorProps
> = ({ password, showFeedback = true }) => {
  const { colors } = useTheme();
  const strength = validatePasswordStrength(password);

  if (!password) return null;

  const getColor = () => {
    switch (strength.score) {
      case 0:
      case 1:
        return "#ef4444"; // red
      case 2:
        return "#f59e0b"; // orange
      case 3:
        return "#eab308"; // yellow
      case 4:
      default:
        return "#22c55e"; // green
    }
  };

  const strengthColor = getColor();

  return (
    <View style={styles.container}>
      <View style={styles.barContainer}>
        {[0, 1, 2, 3, 4].map((index) => (
          <View
            key={index}
            style={[
              styles.bar,
              {
                backgroundColor:
                  index <= strength.score ? strengthColor : colors.border,
              },
            ]}
          />
        ))}
      </View>

      <Text style={[styles.label, { color: strengthColor }]}>
        {strength.label}
      </Text>

      {showFeedback && strength.feedback.length > 0 && (
        <View style={styles.feedbackContainer}>
          {strength.feedback.map((item, index) => (
            <Text key={index} style={[styles.feedback, { color: colors.text }]}>
              • {item}
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
  barContainer: {
    flexDirection: "row",
    gap: 4,
    marginBottom: 8,
  },
  bar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  feedbackContainer: {
    marginTop: 4,
  },
  feedback: {
    fontSize: 12,
    marginVertical: 2,
    opacity: 0.8,
  },
});
