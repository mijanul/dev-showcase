// AuthForm Component - Organism

import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button } from '../../atoms/Button';
import { Text } from '../../atoms/Text';
import { useTheme } from '../../hooks/useTheme';
import { FormField } from '../../molecules/FormField';
import { VALIDATION } from '../../utils/constants';
import { isValidEmail } from '../../utils/helpers';

interface AuthFormProps {
  mode: 'login' | 'signup';
  onSubmit: (email: string, password: string) => Promise<void>;
  onToggleMode: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  mode,
  onSubmit,
  onToggleMode,
  isLoading = false,
  error,
}) => {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < VALIDATION.MIN_PASSWORD_LENGTH) {
      newErrors.password = `Password must be at least ${VALIDATION.MIN_PASSWORD_LENGTH} characters`;
    }

    if (mode === 'signup') {
      if (!confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      await onSubmit(email, password);
    } catch (err) {
      // Error is handled by parent component
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <Text
            variant="h2"
            weight="bold"
            align="center"
            style={{ marginBottom: theme.spacing['2xl'] }}
          >
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </Text>

          {error && (
            <View
              style={[
                styles.errorContainer,
                {
                  backgroundColor: theme.colors.error + '20',
                  borderColor: theme.colors.error,
                  borderWidth: 1,
                  borderRadius: theme.borderRadius.base,
                  padding: theme.spacing.md,
                  marginBottom: theme.spacing.base,
                },
              ]}
            >
              <Text variant="bodySmall" color="error">
                {error}
              </Text>
            </View>
          )}

          <FormField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <FormField
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            error={errors.password}
            secureTextEntry
            autoCapitalize="none"
          />

          {mode === 'signup' && (
            <FormField
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm your password"
              error={errors.confirmPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          )}

          <Button
            title={mode === 'login' ? 'Login' : 'Sign Up'}
            onPress={handleSubmit}
            loading={isLoading}
            fullWidth
            style={{ marginTop: theme.spacing.lg }}
          />

          <View style={styles.toggleContainer}>
            <Text variant="body" color="textSecondary">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            </Text>
            <Button
              title={mode === 'login' ? 'Sign Up' : 'Login'}
              onPress={onToggleMode}
              variant="ghost"
              size="small"
            />
          </View>
        </View>
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
    justifyContent: 'center',
  },
  formContainer: {
    padding: 24,
  },
  errorContainer: {
    marginBottom: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
});
