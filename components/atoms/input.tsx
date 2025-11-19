import { useTheme } from "@/context/theme-context";
import React from "react";
import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  StyleSheet,
  View,
} from "react-native";

export interface InputProps extends RNTextInputProps {
  error?: boolean;
}

export const Input = React.forwardRef<RNTextInput, InputProps>(
  ({ error, style, ...props }, ref) => {
    const { colors } = useTheme();

    return (
      <View style={styles.container}>
        <RNTextInput
          ref={ref}
          style={[
            styles.input,
            {
              backgroundColor: colors.inputBackground,
              borderColor: error ? colors.error : colors.border,
              color: colors.text,
            },
            style,
          ]}
          placeholderTextColor={colors.placeholder}
          {...props}
        />
      </View>
    );
  }
);

Input.displayName = "Input";

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: "system-ui",
  },
});
