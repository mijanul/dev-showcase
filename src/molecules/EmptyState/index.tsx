// EmptyState Component - Molecule

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '../../atoms/Text';
import { useTheme } from '../../hooks/useTheme';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'document-text-outline',
  title,
  description,
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Ionicons
        name={icon}
        size={64}
        color={theme.colors.textTertiary}
        style={{ marginBottom: theme.spacing.base }}
      />
      <Text variant="h3" color="textSecondary" align="center">
        {title}
      </Text>
      {description && (
        <Text
          variant="body"
          color="textTertiary"
          align="center"
          style={{ marginTop: theme.spacing.sm }}
        >
          {description}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
});
