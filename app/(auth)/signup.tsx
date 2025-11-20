import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../src/hooks/useAuth";
import { useTheme } from "../../src/hooks/useTheme";
import { AuthForm } from "../../src/organisms/AuthForm";

export default function SignupScreen() {
  const { theme } = useTheme();
  const { signUp, error, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (email: string, password: string) => {
    try {
      await signUp(email, password);
      router.replace("/(app)/tasks");
    } catch (err) {
      // Error is handled by useAuth hook
    }
  };

  const handleToggleMode = () => {
    router.back();
  };

  const gradientColors = theme.isDark
    ? ["#0f3460", "#16213e", "#1a1a2e"]
    : ["#f093fb", "#764ba2", "#667eea"];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.content, { backgroundColor: "transparent" }]}>
          <AuthForm
            mode="signup"
            onSubmit={handleSubmit}
            onToggleMode={handleToggleMode}
            isLoading={isLoading}
            error={error}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
});
