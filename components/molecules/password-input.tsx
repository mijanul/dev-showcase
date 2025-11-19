import { useTheme } from "@/context/theme-context";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { Text } from "../atoms/text";

export interface PasswordInputProps
  extends Omit<TextInputProps, "secureTextEntry"> {
  label: string;
  error?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  error,
  style,
  editable = true,
  ...inputProps
}) => {
  const { colors } = useTheme();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.secondary }]}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            {
              color: colors.text,
              backgroundColor: colors.inputBackground,
              borderColor: error ? colors.error : colors.border,
              opacity: editable ? 1 : 0.5,
            },
            style,
          ]}
          placeholderTextColor={colors.placeholder}
          secureTextEntry={!isPasswordVisible}
          editable={editable}
          {...inputProps}
        />
        <Pressable
          onPress={togglePasswordVisibility}
          style={styles.iconButton}
          hitSlop={8}
          disabled={!editable}
        >
          <Ionicons
            name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
            size={24}
            color={editable ? colors.secondary : colors.border}
          />
        </Pressable>
      </View>
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
  inputContainer: {
    position: "relative",
    width: "100%",
  },
  input: {
    width: "100%",
    padding: 16,
    paddingRight: 48,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
  },
  iconButton: {
    position: "absolute",
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    width: 40,
  },
  errorText: {
    fontSize: 14,
    marginTop: 4,
    marginLeft: 4,
  },
});
