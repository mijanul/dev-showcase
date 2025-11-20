// FormField Component - Molecule

import React from "react";
import { StyleSheet, View } from "react-native";
import { Input } from "../../atoms/Input";

interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  secureTextEntry?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  multiline?: boolean;
  numberOfLines?: number;
  showPasswordToggle?: boolean;
  leftIcon?: keyof typeof import("@expo/vector-icons").Ionicons.glyphMap;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry,
  autoCapitalize = "sentences",
  keyboardType = "default",
  multiline = false,
  numberOfLines = 1,
  showPasswordToggle = false,
  leftIcon,
}) => {
  return (
    <View style={styles.container}>
      <Input
        label={label}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        error={error}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        showPasswordToggle={showPasswordToggle}
        leftIcon={leftIcon}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
});
