import { IconButton } from "@/components/atoms/icon-button";
import { AuthFooter } from "@/components/organisms/auth-footer";
import { AuthHeader } from "@/components/organisms/auth-header";
import {
  RegistrationForm,
  RegistrationFormData,
} from "@/components/organisms/registration-form";
import { useAuth } from "@/context/auth-context";
import { useTheme } from "@/context/theme-context";
import { Alert } from "@/utils/alert";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

export default function SignupScreen() {
  const router = useRouter();
  const { colors, theme, toggleTheme } = useTheme();
  const {
    signup,
    partialRegistration,
    savePartialRegistration,
    clearPartialRegistration,
  } = useAuth();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setIsKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setIsKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleSignup = async (data: RegistrationFormData) => {
    try {
      const fullPhone = data.phoneNumber
        ? `${data.countryCode}${data.phoneNumber}`
        : undefined;

      await signup(
        data.firstName,
        data.lastName,
        data.email,
        data.password,
        fullPhone
      );

      // Clear partial registration data after successful signup
      await clearPartialRegistration();

      Alert.alert(
        "Account Created Successfully! 🎉",
        `Welcome, ${data.firstName} ${data.lastName}!\n\nYour account has been created and you're now logged in.`,
        [
          {
            text: "Get Started",
            onPress: () => router.replace("/account"),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        "Signup Failed",
        error instanceof Error
          ? error.message
          : "An error occurred during signup",
        [{ text: "OK" }]
      );
    }
  };

  const handleLoginPress = () => {
    router.back();
  };

  return (
    <>
      <Stack.Screen
        options={{ title: "dev-showcase | Sign Up", headerShown: false }}
      />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <AuthHeader />
        <View style={styles.header}>
          <IconButton
            name={theme === "dark" ? "sunny-outline" : "moon-outline"}
            onPress={toggleTheme}
            size={28}
          />
        </View>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={
            isKeyboardVisible || Platform.OS === "ios" ? "padding" : "height"
          }
          keyboardVerticalOffset={
            isKeyboardVisible ? (Platform.OS === "ios" ? 60 : 100) : 0
          }
          enabled
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <RegistrationForm
              onSubmit={handleSignup}
              onLoginPress={handleLoginPress}
              initialData={partialRegistration || undefined}
              onPartialSave={savePartialRegistration}
            />
          </ScrollView>
        </KeyboardAvoidingView>
        <AuthFooter />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
});
