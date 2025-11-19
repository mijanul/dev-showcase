import { useTheme } from "@/context/theme-context";
import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { Input, Text } from "../atoms";

export interface FormInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  editable?: boolean;
  rules?: {
    required?: string | boolean;
    pattern?: {
      value: RegExp;
      message: string;
    };
    minLength?: {
      value: number;
      message: string;
    };
    maxLength?: {
      value: number;
      message: string;
    };
    validate?: (value: any) => string | boolean;
  };
}

export function FormInput<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  secureTextEntry,
  autoCapitalize = "none",
  keyboardType = "default",
  editable = true,
  rules,
}: FormInputProps<T>) {
  const { colors } = useTheme();

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <View style={styles.container}>
          {label && (
            <Text variant="body" style={[styles.label, { color: colors.text }]}>
              {label}
            </Text>
          )}
          <Input
            placeholder={placeholder}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!error}
            secureTextEntry={secureTextEntry}
            autoCapitalize={autoCapitalize}
            keyboardType={keyboardType}
            autoCorrect={false}
            editable={editable}
          />
          {error && (
            <Text
              variant="caption"
              style={[styles.error, { color: colors.error }]}
            >
              {error.message}
            </Text>
          )}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontWeight: "500",
  },
  error: {
    marginTop: 4,
  },
});
