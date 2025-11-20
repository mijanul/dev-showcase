import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../src/atoms/Button';
import { Text } from '../../src/atoms/Text';
import { useAuth } from '../../src/hooks/useAuth';
import { useTheme } from '../../src/hooks/useTheme';
import { sqliteService } from '../../src/services/database/sqlite';

export default function SettingsScreen() {
  const { theme, themeMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await sqliteService.clearAllData();
              await logout();
              router.replace('/(auth)/login');
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* User Info Section */}
        <View
          style={[
            styles.section,
            {
              backgroundColor: theme.colors.surface,
              borderRadius: theme.borderRadius.base,
              padding: theme.spacing.base,
              marginBottom: theme.spacing.base,
              ...theme.shadows.sm,
            },
          ]}
        >
          <View style={styles.userInfo}>
            <View
              style={[
                styles.avatar,
                {
                  backgroundColor: theme.colors.primary,
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: theme.spacing.md,
                },
              ]}
            >
              <Text variant="h2" color="textInverse">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
            <Text variant="h4" weight="semibold">
              {user?.displayName || 'User'}
            </Text>
            <Text variant="body" color="textSecondary" style={{ marginTop: 4 }}>
              {user?.email}
            </Text>
          </View>
        </View>

        {/* Appearance Section */}
        <View
          style={[
            styles.section,
            {
              backgroundColor: theme.colors.surface,
              borderRadius: theme.borderRadius.base,
              padding: theme.spacing.base,
              marginBottom: theme.spacing.base,
              ...theme.shadows.sm,
            },
          ]}
        >
          <Text variant="h4" weight="semibold" style={{ marginBottom: theme.spacing.md }}>
            Appearance
          </Text>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons
                name={themeMode === 'dark' ? 'moon' : 'sunny'}
                size={24}
                color={theme.colors.primary}
                style={{ marginRight: theme.spacing.md }}
              />
              <View>
                <Text variant="body" weight="medium">
                  Dark Mode
                </Text>
                <Text variant="caption" color="textSecondary">
                  {themeMode === 'dark' ? 'Enabled' : 'Disabled'}
                </Text>
              </View>
            </View>
            <Switch
              value={themeMode === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={theme.colors.textInverse}
            />
          </View>
        </View>

        {/* About Section */}
        <View
          style={[
            styles.section,
            {
              backgroundColor: theme.colors.surface,
              borderRadius: theme.borderRadius.base,
              padding: theme.spacing.base,
              marginBottom: theme.spacing.base,
              ...theme.shadows.sm,
            },
          ]}
        >
          <Text variant="h4" weight="semibold" style={{ marginBottom: theme.spacing.md }}>
            About
          </Text>
          <View style={styles.aboutRow}>
            <Text variant="body" color="textSecondary">
              Version
            </Text>
            <Text variant="body" weight="medium">
              1.0.0
            </Text>
          </View>
          <View style={[styles.aboutRow, { marginTop: theme.spacing.sm }]}>
            <Text variant="body" color="textSecondary">
              Environment
            </Text>
            <Text variant="body" weight="medium">
              Development
            </Text>
          </View>
        </View>

        {/* Logout Button */}
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="outline"
          fullWidth
          style={{ marginTop: theme.spacing.lg }}
        />

        {/* Footer */}
        <Text
          variant="caption"
          color="textTertiary"
          align="center"
          style={{ marginTop: theme.spacing['2xl'] }}
        >
          Task Manager © 2025
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  userInfo: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
