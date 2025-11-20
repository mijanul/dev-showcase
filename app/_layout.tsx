import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { ThemeProvider } from '../src/contexts/ThemeContext';
import { useTheme } from '../src/hooks/useTheme';
import { sqliteService } from '../src/services/database/sqlite';
import { store } from '../src/store';

function RootLayoutContent() {
  const [isReady, setIsReady] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    async function initialize() {
      try {
        // Initialize database
        await sqliteService.initialize();
        console.log('App initialized successfully');
      } catch (error) {
        console.error('Failed to initialize app:', error);
      } finally {
        setIsReady(true);
      }
    }

    initialize();
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(app)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider>
          <RootLayoutContent />
        </ThemeProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}
