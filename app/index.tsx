import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../src/hooks/useAuth';
import { useTheme } from '../src/hooks/useTheme';

export default function Index() {
  const { isAuthenticated, isLoading, checkSession } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to app
      router.replace('/(app)/tasks');
    } else if (isAuthenticated && !segments[0]) {
      // Initial load, user is authenticated
      router.replace('/(app)/tasks');
    } else if (!isAuthenticated && !segments[0]) {
      // Initial load, user is not authenticated
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated, isLoading, segments]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
}
