import { Button, Card, IconButton, Text } from "@/components/atoms";
import { useAuth } from "@/context/auth-context";
import { useTheme } from "@/context/theme-context";
import { Alert } from "@/utils/alert";
import { biometricAuth } from "@/utils/biometric-auth";
import { database, passwordUtils } from "@/utils/database";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AccountScreen() {
  const router = useRouter();
  const { colors, theme, toggleTheme } = useTheme();
  const { user, logout, isAuthenticated } = useAuth();
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricType, setBiometricType] = useState<string>("Biometric");
  const [isWeb, setIsWeb] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [biometricInfo, setBiometricInfo] = useState<{
    hasHardware: boolean;
    isEnrolled: boolean;
  }>({ hasHardware: false, isEnrolled: false });

  useEffect(() => {
    checkBiometricStatus();
    setIsWeb(Platform.OS === "web");
  }, []);

  const checkBiometricStatus = async () => {
    const info = await biometricAuth.isAvailable();
    setBiometricAvailable(info.isAvailable);
    setBiometricType(biometricAuth.getBiometricTypeName(info.biometricType));
    setBiometricInfo({
      hasHardware: info.biometricType !== "none",
      isEnrolled: info.isEnrolled,
    });

    if (info.isAvailable) {
      const enabled = await biometricAuth.isEnabled();
      setBiometricEnabled(enabled);
    }
  };

  const handleBiometricToggle = async (value: boolean) => {
    if (value) {
      // Show password prompt to enable biometric
      if (!user) {
        Alert.alert("Error", "Please login first to enable biometric login.");
        return;
      }
      setShowPasswordModal(true);
    } else {
      await biometricAuth.disable();
      setBiometricEnabled(false);
      Alert.alert("Disabled", `${biometricType} login has been disabled.`);
    }
  };

  const handleEnableBiometric = async () => {
    if (!user || !password) {
      Alert.alert("Error", "Please enter your password.");
      return;
    }

    setIsVerifying(true);
    try {
      // Verify password first
      const dbUser = await database.getUserByEmail(user.email);
      if (!dbUser) {
        Alert.alert("Error", "User not found.");
        return;
      }

      const isPasswordValid = await passwordUtils.comparePassword(
        password,
        dbUser.password
      );

      if (!isPasswordValid) {
        Alert.alert("Error", "Invalid password. Please try again.");
        setPassword("");
        return;
      }

      // Enable biometric with credentials
      const success = await biometricAuth.enable(user.email, password);
      if (success) {
        setBiometricEnabled(true);
        setShowPasswordModal(false);
        setPassword("");
        Alert.alert(
          "Success",
          `${biometricType} login has been enabled successfully. You can now use ${biometricType.toLowerCase()} to login after logging out.`
        );
      } else {
        Alert.alert(
          "Failed",
          `Could not enable ${biometricType} login. Please try again.`
        );
      }
    } catch (error) {
      console.error("Enable biometric error:", error);
      Alert.alert("Error", "An error occurred while enabling biometric login.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    console.log("Logout button clicked");
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          console.log("Logout confirmed");
          try {
            await logout();
            console.log("Logout successful, navigating...");
            router.replace("/auth/login" as any);
          } catch (error) {
            console.error("Logout error:", error);
            Alert.alert("Error", "Failed to logout. Please try again.");
          }
        },
      },
    ]);
  };

  const handleLoginPress = () => {
    router.push("/auth/login" as any);
  };

  return (
    <>
      <Stack.Screen
        options={{ title: "dev-showcase | Account", headerShown: false }}
      />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text variant="h2" style={{ color: colors.text }}>
            Account
          </Text>
          <IconButton
            name={theme === "dark" ? "sunny-outline" : "moon-outline"}
            onPress={toggleTheme}
            size={28}
          />
        </View>

        <ScrollView style={styles.content}>
          {isAuthenticated && user ? (
            <>
              <Card style={styles.card}>
                <Text
                  variant="h3"
                  style={{ color: colors.text, marginBottom: 16 }}
                >
                  Profile Information
                </Text>

                <View style={styles.section}>
                  <Text
                    variant="caption"
                    style={{ color: colors.secondary, marginBottom: 4 }}
                  >
                    FULL NAME
                  </Text>
                  <Text
                    variant="body"
                    style={{ color: colors.text, fontSize: 18 }}
                  >
                    {user.firstName} {user.lastName}
                  </Text>
                </View>

                <View style={styles.section}>
                  <Text
                    variant="caption"
                    style={{ color: colors.secondary, marginBottom: 4 }}
                  >
                    EMAIL ADDRESS
                  </Text>
                  <Text
                    variant="body"
                    style={{ color: colors.text, fontSize: 18 }}
                  >
                    {user.email}
                  </Text>
                </View>

                {user.phoneNumber && (
                  <View style={styles.section}>
                    <Text
                      variant="caption"
                      style={{ color: colors.secondary, marginBottom: 4 }}
                    >
                      PHONE NUMBER
                    </Text>
                    <Text
                      variant="body"
                      style={{ color: colors.text, fontSize: 18 }}
                    >
                      {user.phoneNumber}
                    </Text>
                  </View>
                )}

                <View style={styles.statusSection}>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: colors.success },
                    ]}
                  >
                    <Text
                      variant="caption"
                      style={{ color: "#ffffff", fontWeight: "600" }}
                    >
                      ✓ Account Active
                    </Text>
                  </View>
                </View>
              </Card>

              <Card style={styles.card}>
                <Text
                  variant="h3"
                  style={{ color: colors.text, marginBottom: 16 }}
                >
                  Settings
                </Text>

                <View style={styles.settingItem}>
                  <Text variant="body" style={{ color: colors.text }}>
                    Theme
                  </Text>
                  <Text
                    variant="body"
                    style={{
                      color: colors.secondary,
                      textTransform: "capitalize",
                    }}
                  >
                    {theme}
                  </Text>
                </View>

                {/* Biometric Authentication Setting */}
                {isWeb ? (
                  <View style={styles.settingItem}>
                    <View style={{ flex: 1 }}>
                      <Text variant="body" style={{ color: colors.text }}>
                        Biometric Login
                      </Text>
                      <Text
                        variant="caption"
                        style={{ color: colors.secondary, marginTop: 4 }}
                      >
                        Available on mobile app only
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.infoBadge,
                        { backgroundColor: colors.border },
                      ]}
                    >
                      <Text
                        variant="caption"
                        style={{ color: colors.secondary }}
                      >
                        Mobile Only
                      </Text>
                    </View>
                  </View>
                ) : biometricAvailable ? (
                  <View style={styles.settingItem}>
                    <View style={{ flex: 1 }}>
                      <Text variant="body" style={{ color: colors.text }}>
                        {biometricType} Login
                      </Text>
                      <Text
                        variant="caption"
                        style={{ color: colors.secondary, marginTop: 4 }}
                      >
                        Use {biometricType.toLowerCase()} to login quickly
                      </Text>
                    </View>
                    <Switch
                      value={biometricEnabled}
                      onValueChange={handleBiometricToggle}
                      trackColor={{
                        false: colors.border,
                        true: colors.primary,
                      }}
                      thumbColor={biometricEnabled ? "#ffffff" : "#f4f3f4"}
                    />
                  </View>
                ) : null}

                {/* Info banner when biometric hardware exists but not enrolled */}
                {biometricInfo.hasHardware &&
                  !biometricInfo.isEnrolled &&
                  !isWeb && (
                    <View
                      style={[
                        styles.biometricInfoBanner,
                        {
                          backgroundColor: colors.warning + "15",
                          borderColor: colors.warning + "40",
                        },
                      ]}
                    >
                      <View style={styles.biometricInfoContent}>
                        <Text style={styles.biometricInfoIcon}>⚠️</Text>
                        <View style={{ flex: 1 }}>
                          <Text
                            variant="body"
                            style={{
                              color: colors.warning,
                              fontWeight: "600",
                              marginBottom: 4,
                            }}
                          >
                            Biometric Not Set Up
                          </Text>
                          <Text
                            variant="caption"
                            style={{ color: colors.secondary }}
                          >
                            Set up biometric authentication in your device
                            settings to enable quick login
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}
              </Card>

              <View style={styles.buttonContainer}>
                <Button
                  variant="outline"
                  size="large"
                  onPress={handleLogout}
                  style={[styles.logoutButton, { borderColor: colors.error }]}
                  testID="logout-button"
                >
                  <Text style={{ color: colors.error, fontWeight: "600" }}>
                    Logout
                  </Text>
                </Button>
              </View>
            </>
          ) : (
            <>
              <Card style={styles.card}>
                <Text
                  variant="h3"
                  style={{ color: colors.text, marginBottom: 8 }}
                >
                  Not Logged In
                </Text>
                <Text
                  variant="body"
                  style={{ color: colors.secondary, marginBottom: 24 }}
                >
                  Please login to view your account details
                </Text>

                <Button
                  variant="primary"
                  size="large"
                  onPress={handleLoginPress}
                >
                  Go to Login
                </Button>
              </Card>
            </>
          )}
        </ScrollView>

        {/* Password Modal for Enabling Biometric */}
        <Modal
          visible={showPasswordModal}
          transparent
          animationType="fade"
          onRequestClose={() => {
            setShowPasswordModal(false);
            setPassword("");
          }}
        >
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modalContent,
                { backgroundColor: colors.cardBackground },
              ]}
            >
              <Text
                variant="h3"
                style={{ color: colors.text, marginBottom: 8 }}
              >
                Enable {biometricType}
              </Text>
              <Text
                variant="body"
                style={{ color: colors.secondary, marginBottom: 24 }}
              >
                Enter your password to securely enable{" "}
                {biometricType.toLowerCase()} login
              </Text>

              <View style={styles.inputContainer}>
                <Text
                  variant="caption"
                  style={{ color: colors.secondary, marginBottom: 8 }}
                >
                  PASSWORD
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      color: colors.text,
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                    },
                  ]}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.secondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoFocus
                  editable={!isVerifying}
                />
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  onPress={() => {
                    setShowPasswordModal(false);
                    setPassword("");
                  }}
                  disabled={isVerifying}
                  style={[
                    styles.modalButton,
                    { backgroundColor: colors.border },
                  ]}
                >
                  <Text style={{ color: colors.text, fontWeight: "600" }}>
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleEnableBiometric}
                  disabled={isVerifying || !password}
                  style={[
                    styles.modalButton,
                    {
                      backgroundColor:
                        isVerifying || !password
                          ? colors.border
                          : colors.primary,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color:
                        isVerifying || !password ? colors.secondary : "#fff",
                      fontWeight: "600",
                    }}
                  >
                    {isVerifying ? "Verifying..." : "Enable"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  section: {
    marginBottom: 20,
  },
  statusSection: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  infoBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  biometricInfoBanner: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  biometricInfoContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  biometricInfoIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  buttonContainer: {
    marginTop: 8,
    marginBottom: 32,
  },
  logoutButton: {
    backgroundColor: "transparent",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
});
