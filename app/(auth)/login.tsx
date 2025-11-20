import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../src/hooks/useAuth';
import { useTheme } from '../../src/hooks/useTheme';
import { AuthForm } from '../../src/organisms/AuthForm';

export default function LoginScreen() {
  const { theme } = useTheme();
  const { login, error, isLoading } = useAuth();
  const router = useRouter();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const handleSubmit = async (email: string, password: string) => {
    try {
      await login(email, password);
      router.replace('/(app)/tasks');
    } catch (err) {
      // Error is handled by useAuth hook
    }
  };

  const handleToggleMode = () => {
    if (authMode === 'login') {
      router.push('/(auth)/signup');
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <AuthForm
          mode="login"
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
