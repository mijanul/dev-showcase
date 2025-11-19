import { useTheme } from "@/context/theme-context";
import React from "react";
import { Image, Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "../atoms/text";

export const AuthHeader: React.FC = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.topBar,
          {
            backgroundColor: colors.primary,
            paddingTop: Platform.OS === "ios" ? insets.top : insets.top + 8,
          },
        ]}
      >
        <Text style={styles.contactText}>
          Open 24/7 | Call: (+91) 7797979756 | Email: hi@mijanul.in
        </Text>
      </View>
      <View
        style={[
          styles.logoContainer,
          {
            backgroundColor: colors.cardBackground,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Image
          source={require("@/assets/images/react-logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  topBar: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  contactText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  logoContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: "center",
    borderBottomWidth: 1,
  },
  logo: {
    width: "100%",
    height: 60,
  },
});
