import { PartialRegistrationData } from "@/context/auth-context";
import {
  validateEmail,
  validatePasswordStrength,
  validateRequiredField,
} from "@/utils/validation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Button } from "../atoms/button";
import { Card } from "../atoms/card";
import { Text } from "../atoms/text";
import { FormHeader } from "../molecules/form-header";
import { LabeledInput } from "../molecules/labeled-input";
import { LinkText } from "../molecules/link-text";
import { PasswordInput } from "../molecules/password-input";
import { PasswordStrengthIndicator } from "../molecules/password-strength-indicator";
import { PhoneInput } from "../molecules/phone-input";

export interface RegistrationFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  countryCode: string;
}

export interface RegistrationFormProps {
  onSubmit: (data: RegistrationFormData) => void | Promise<void>;
  onLoginPress: () => void;
  loading?: boolean;
  initialData?: PartialRegistrationData;
  onPartialSave?: (data: PartialRegistrationData) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onSubmit,
  onLoginPress,
  loading = false,
  initialData,
  onPartialSave,
}) => {
  const {
    handleSubmit,
    watch,
    setValue,
    register,
    setError,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    mode: "onSubmit",
    defaultValues: {
      email: initialData?.email || "",
      password: "",
      confirmPassword: "",
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
      phoneNumber: initialData?.phoneNumber || "",
      countryCode: initialData?.countryCode || "US",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countryCode, setCountryCode] = useState(
    initialData?.countryCode || "US"
  );

  // Watch individual fields
  const email = watch("email");
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const firstName = watch("firstName");
  const lastName = watch("lastName");
  const formValues = watch();

  // Register fields with validation
  useEffect(() => {
    register("email", {
      required: "Email is required",
      validate: (value) =>
        validateEmail(value) || "Please enter a valid email address",
    });
    register("password", {
      required: "Password is required",
      validate: (value) => {
        const strength = validatePasswordStrength(value);
        if (strength.score < 2) {
          return "Password is too weak";
        }
        return true;
      },
    });
    register("confirmPassword", {
      required: "Please confirm your password",
    });
    register("firstName", {
      required: "First name is required",
      validate: (value) =>
        validateRequiredField(value) || "First name cannot be empty",
    });
    register("lastName", {
      required: "Last name is required",
      validate: (value) =>
        validateRequiredField(value) || "Last name cannot be empty",
    });
  }, [register]);

  // Check if all required fields have values
  const hasRequiredFields = Boolean(
    email?.trim() &&
      password?.trim() &&
      confirmPassword?.trim() &&
      firstName?.trim() &&
      lastName?.trim()
  );

  // Auto-save partial registration data
  useEffect(() => {
    if (onPartialSave) {
      const timer = setTimeout(() => {
        const partialData: PartialRegistrationData = {
          email: formValues.email,
          firstName: formValues.firstName,
          lastName: formValues.lastName,
          phoneNumber: formValues.phoneNumber,
          countryCode: formValues.countryCode,
        };
        onPartialSave(partialData);
      }, 1000); // Debounce for 1 second

      return () => clearTimeout(timer);
    }
  }, [formValues, onPartialSave]);

  const validateForm = async () => {
    let isValid = true;

    // Validate email
    if (!email?.trim()) {
      setError("email", { type: "required", message: "Email is required" });
      isValid = false;
    } else if (!validateEmail(email)) {
      setError("email", {
        type: "validate",
        message: "Please enter a valid email address",
      });
      isValid = false;
    }

    // Validate password
    if (!password?.trim()) {
      setError("password", {
        type: "required",
        message: "Password is required",
      });
      isValid = false;
    } else {
      const strength = validatePasswordStrength(password);
      if (strength.score < 2) {
        setError("password", {
          type: "validate",
          message: "Password is too weak",
        });
        isValid = false;
      }
    }

    // Validate confirm password
    if (!confirmPassword?.trim()) {
      setError("confirmPassword", {
        type: "required",
        message: "Please confirm your password",
      });
      isValid = false;
    } else if (confirmPassword !== password) {
      setError("confirmPassword", {
        type: "validate",
        message: "Passwords do not match",
      });
      isValid = false;
    }

    // Validate first name
    if (!firstName?.trim()) {
      setError("firstName", {
        type: "required",
        message: "First name is required",
      });
      isValid = false;
    } else if (!validateRequiredField(firstName)) {
      setError("firstName", {
        type: "validate",
        message: "First name cannot be empty",
      });
      isValid = false;
    }

    // Validate last name
    if (!lastName?.trim()) {
      setError("lastName", {
        type: "required",
        message: "Last name is required",
      });
      isValid = false;
    } else if (!validateRequiredField(lastName)) {
      setError("lastName", {
        type: "validate",
        message: "Last name cannot be empty",
      });
      isValid = false;
    }

    return isValid;
  };

  const handleFormSubmit = async (data: RegistrationFormData) => {
    const isFormValid = await validateForm();
    if (!isFormValid) {
      return;
    }

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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.card}>
          <FormHeader
            title="Account setup"
            subtitle="Create your account to get started"
          />

          <View style={styles.formContent}>
            {/* Email */}
            <LabeledInput
              label="EMAIL ADDRESS"
              value={email}
              onChangeText={(text) =>
                setValue("email", text, { shouldValidate: true })
              }
              error={errors.email?.message}
              placeholder="your.email@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              accessibilityLabel="Email address"
              accessibilityHint="Enter your email address for account creation"
              returnKeyType="next"
            />

            {/* Password */}
            <View>
              <PasswordInput
                label="PASSWORD"
                value={password}
                onChangeText={(text) =>
                  setValue("password", text, { shouldValidate: true })
                }
                error={errors.password?.message}
                placeholder="Enter a strong password"
                autoCapitalize="none"
                autoComplete="password-new"
                accessibilityLabel="Password"
                accessibilityHint="Create a strong password with at least 8 characters"
                returnKeyType="next"
              />
              <PasswordStrengthIndicator password={password || ""} />
            </View>

            {/* Confirm Password */}
            <PasswordInput
              label="CONFIRM PASSWORD"
              value={confirmPassword}
              onChangeText={(text) =>
                setValue("confirmPassword", text, { shouldValidate: true })
              }
              error={errors.confirmPassword?.message}
              placeholder="Re-enter your password"
              autoCapitalize="none"
              autoComplete="password-new"
              accessibilityLabel="Confirm password"
              accessibilityHint="Re-enter the same password to confirm"
              returnKeyType="next"
            />

            {/* First Name */}
            <LabeledInput
              label="FIRST NAME"
              value={firstName}
              onChangeText={(text) =>
                setValue("firstName", text, { shouldValidate: true })
              }
              error={errors.firstName?.message}
              placeholder="John"
              autoCapitalize="words"
              autoComplete="name-given"
              accessibilityLabel="First name"
              accessibilityHint="Enter your first name"
              returnKeyType="next"
            />

            {/* Last Name */}
            <LabeledInput
              label="LAST NAME"
              value={lastName}
              onChangeText={(text) =>
                setValue("lastName", text, { shouldValidate: true })
              }
              error={errors.lastName?.message}
              placeholder="Doe"
              autoCapitalize="words"
              autoComplete="name-family"
              accessibilityLabel="Last name"
              accessibilityHint="Enter your last name"
              returnKeyType="next"
            />

            {/* Phone Number */}
            <View style={styles.phoneContainer}>
              <PhoneInput
                value={watch("phoneNumber") || ""}
                onChangeValue={(value) => setValue("phoneNumber", value)}
                countryCode={countryCode}
                onChangeCountryCode={(code) => {
                  setCountryCode(code);
                  setValue("countryCode", code);
                }}
                error={errors.phoneNumber?.message}
                accessibilityLabel="Phone number"
                accessibilityHint="Enter your phone number (optional)"
              />
            </View>

            <Button
              onPress={handleSubmit(handleFormSubmit)}
              disabled={!hasRequiredFields || isSubmitting || loading}
              loading={isSubmitting || loading}
              accessibilityLabel="Create account"
              accessibilityHint="Creates your account with the provided information"
            >
              <Text>SAVE & START</Text>
            </Button>

            <View style={styles.loginLink}>
              <LinkText
                text="Already registered?"
                linkText="Sign in here"
                onPress={onLoginPress}
              />
            </View>
          </View>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
  },
  formContent: {
    gap: 16,
  },
  phoneContainer: {
    width: "100%",
  },
  loginLink: {
    marginTop: 8,
  },
});
