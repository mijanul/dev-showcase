import { Button, Card, IconButton, Input, Text } from "@/components/atoms";
import { useTheme } from "@/context/theme-context";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function ComponentShowcase() {
  const { colors, theme, toggleTheme } = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <Text variant="h1">Component Showcase</Text>
        <IconButton
          name={theme === "dark" ? "sunny-outline" : "moon-outline"}
          onPress={toggleTheme}
          size={28}
        />
      </View>

      <Card style={styles.section}>
        <Text variant="h2" style={styles.sectionTitle}>
          Typography
        </Text>
        <Text variant="h1">Heading 1</Text>
        <Text variant="h2">Heading 2</Text>
        <Text variant="h3">Heading 3</Text>
        <Text variant="body">Body text - Lorem ipsum dolor sit amet</Text>
        <Text variant="caption">Caption text - smaller text for hints</Text>
        <Text variant="link">Link text - clickable link</Text>
      </Card>

      <Card style={styles.section}>
        <Text variant="h2" style={styles.sectionTitle}>
          Buttons
        </Text>
        <Button variant="primary" size="large">
          Primary Large
        </Button>
        <View style={styles.spacer} />
        <Button variant="primary" size="medium">
          Primary Medium
        </Button>
        <View style={styles.spacer} />
        <Button variant="primary" size="small">
          Primary Small
        </Button>
        <View style={styles.spacer} />
        <Button variant="secondary">Secondary</Button>
        <View style={styles.spacer} />
        <Button variant="outline">Outline</Button>
        <View style={styles.spacer} />
        <Button variant="ghost">Ghost</Button>
        <View style={styles.spacer} />
        <Button variant="primary" loading>
          Loading...
        </Button>
        <View style={styles.spacer} />
        <Button variant="primary" disabled>
          Disabled
        </Button>
      </Card>

      <Card style={styles.section}>
        <Text variant="h2" style={styles.sectionTitle}>
          Inputs
        </Text>
        <Input placeholder="Default input" />
        <View style={styles.spacer} />
        <Input placeholder="Email input" keyboardType="email-address" />
        <View style={styles.spacer} />
        <Input placeholder="Password input" secureTextEntry />
        <View style={styles.spacer} />
        <Input placeholder="Error state" error />
      </Card>

      <Card style={styles.section}>
        <Text variant="h2" style={styles.sectionTitle}>
          Colors
        </Text>
        <View style={styles.colorRow}>
          <View
            style={[styles.colorBox, { backgroundColor: colors.primary }]}
          />
          <Text>Primary: {colors.primary}</Text>
        </View>
        <View style={styles.colorRow}>
          <View
            style={[styles.colorBox, { backgroundColor: colors.secondary }]}
          />
          <Text>Secondary: {colors.secondary}</Text>
        </View>
        <View style={styles.colorRow}>
          <View style={[styles.colorBox, { backgroundColor: colors.error }]} />
          <Text>Error: {colors.error}</Text>
        </View>
        <View style={styles.colorRow}>
          <View
            style={[styles.colorBox, { backgroundColor: colors.success }]}
          />
          <Text>Success: {colors.success}</Text>
        </View>
        <View style={styles.colorRow}>
          <View
            style={[styles.colorBox, { backgroundColor: colors.warning }]}
          />
          <Text>Warning: {colors.warning}</Text>
        </View>
      </Card>

      <View style={styles.bottomSpacer} />
    </ScrollView>
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
  section: {
    margin: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  spacer: {
    height: 12,
  },
  colorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  colorBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  bottomSpacer: {
    height: 40,
  },
});
