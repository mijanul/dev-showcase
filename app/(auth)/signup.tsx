import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../src/hooks/useAuth';
import { useTheme } from '../../src/hooks/useTheme';
import { AuthForm } from '../../src/organisms/AuthForm';

export default function SignupScreen() {
  const { theme } = useTheme();
  const { signUp, error, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (email: string, password: string) => {
    try {
      await signUp(email, password);
      router.replace('/(app)/tasks');
    } catch (err) {
      // Error is handled by useAuth hook
    }
  };

  const handleToggleMode = () => {
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <AuthForm
          mode="signup"
          onSubmit={handleSubmit}
          onToggleMode={handleToggleMode}
          isLoading={isLoading}
          error={error}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
});
