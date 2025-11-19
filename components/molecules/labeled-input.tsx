import { useTheme } from "@/context/theme-context";
import React from "react";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";
import { Text } from "../atoms/text";

export interface LabeledInputProps extends TextInputProps {
  label: string;
  error?: string;
}

export const LabeledInput: React.FC<LabeledInputProps> = ({
  label,
  error,
  style,
  ...inputProps
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.secondary }]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          {
            color: colors.text,
            backgroundColor: colors.inputBackground,
            borderColor: error ? colors.error : colors.border,
          },
          style,
        ]}
        placeholderTextColor={colors.placeholder}
        {...inputProps}
      />
      {error && (
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  input: {
    width: "100%",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
  },
  errorText: {
    fontSize: 14,
    marginTop: 4,
    marginLeft: 4,
  },
});
