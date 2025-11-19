import { useTheme } from "@/context/theme-context";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "../atoms/text";

export interface CheckboxProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  disabled?: boolean;
}

export function Checkbox<T extends FieldValues>({
  name,
  control,
  label,
  disabled = false,
}: CheckboxProps<T>) {
  const { colors } = useTheme();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <TouchableOpacity
          style={styles.container}
          onPress={() => !disabled && onChange(!value)}
          activeOpacity={disabled ? 1 : 0.7}
          disabled={disabled}
        >
          <View
            style={[
              styles.checkbox,
              {
                borderColor: disabled ? colors.secondary : colors.border,
                backgroundColor: value
                  ? disabled
                    ? colors.secondary
                    : colors.primary
                  : "transparent",
                opacity: disabled ? 0.5 : 1,
              },
            ]}
          >
            {value && <Ionicons name="checkmark" size={16} color="#ffffff" />}
          </View>
          <Text
            variant="body"
            style={[
              styles.label,
              { color: disabled ? colors.secondary : colors.text },
            ]}
          >
            {label}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  label: {
    fontSize: 14,
  },
});
