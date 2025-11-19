import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Button } from "../atoms/button";
import { Card } from "../atoms/card";
import { FormHeader } from "../molecules/form-header";
import { FormInput } from "../molecules/form-input";
import { LinkText } from "../molecules/link-text";

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SignupFormProps {
  onSubmit: (data: SignupFormData) => void | Promise<void>;
  onLoginPress: () => void;
  loading?: boolean;
}

export const SignupForm: React.FC<SignupFormProps> = ({
  onSubmit,
  onLoginPress,
  loading = false,
}) => {
  const { control, handleSubmit, watch } = useForm<SignupFormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const password = watch("password");

  const handleFormSubmit = async (data: SignupFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Card style={styles.card}>
        <FormHeader title="Create Account" subtitle="Sign up to get started" />

        <View style={styles.form}>
          <FormInput
            name="name"
            control={control}
            label="Full Name"
            placeholder="Enter your full name"
            autoCapitalize="words"
            rules={{
              required: "Name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters",
              },
            }}
          />

          <FormInput
            name="email"
            control={control}
            label="Email"
            placeholder="Enter your email"
            keyboardType="email-address"
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            }}
          />

          <FormInput
            name="password"
            control={control}
            label="Password"
            placeholder="Enter your password"
            secureTextEntry
            rules={{
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                message:
                  "Password must contain uppercase, lowercase, and number",
              },
            }}
          />

          <FormInput
            name="confirmPassword"
            control={control}
            label="Confirm Password"
            placeholder="Confirm your password"
            secureTextEntry
            rules={{
              required: "Please confirm your password",
              validate: (value) =>
                value === password || "Passwords do not match",
            }}
          />

          <Button
            variant="primary"
            size="large"
            onPress={handleSubmit(handleFormSubmit)}
            loading={isSubmitting || loading}
            style={styles.submitButton}
          >
            Sign Up
          </Button>

          <View style={styles.linkContainer}>
            <LinkText
              text="Already have an account?"
              linkText="Sign In"
              onPress={onLoginPress}
            />
          </View>
        </View>
      </Card>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  form: {
    width: "100%",
  },
  submitButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  linkContainer: {
    marginTop: 8,
  },
});
