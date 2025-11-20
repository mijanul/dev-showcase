// TaskItem Component - Molecule

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Checkbox } from "../../atoms/Checkbox";
import { Text } from "../../atoms/Text";
import { useTheme } from "../../hooks/useTheme";
import { formatDate } from "../../utils/helpers";
import { Task } from "../../utils/types";

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const SWIPE_THRESHOLD = -80;

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onEdit,
  onDelete,
}) => {
  const { theme } = useTheme();
  const translateX = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationX < 0) {
        translateX.value = Math.max(event.translationX, SWIPE_THRESHOLD * 2);
      }
    })
    .onEnd(() => {
      if (translateX.value < SWIPE_THRESHOLD) {
        translateX.value = withTiming(SWIPE_THRESHOLD);
      } else {
        translateX.value = withTiming(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handleEdit = () => {
    translateX.value = withTiming(0);
    onEdit();
  };

  const handleDelete = () => {
    translateX.value = withTiming(0);
    onDelete();
  };

  return (
    <View style={styles.container}>
      {/* Swipe Actions */}
      <View
        style={[
          styles.actionsContainer,
          {
            backgroundColor: theme.colors.backgroundSecondary,
          },
        ]}
      >
        <Pressable
          style={[styles.actionButton, { backgroundColor: theme.colors.info }]}
          onPress={handleEdit}
        >
          <Ionicons name="pencil" size={20} color={theme.colors.textInverse} />
        </Pressable>
        <Pressable
          style={[styles.actionButton, { backgroundColor: theme.colors.error }]}
          onPress={handleDelete}
        >
          <Ionicons name="trash" size={20} color={theme.colors.textInverse} />
        </Pressable>
      </View>

      {/* Task Content */}
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            styles.taskContent,
            animatedStyle,
            {
              backgroundColor: task.completed
                ? theme.colors.taskCompleted
                : theme.colors.surface,
              borderRadius: theme.borderRadius.base,
              padding: theme.spacing.base,
              ...theme.shadows.sm,
            },
          ]}
        >
          <View style={styles.taskRow}>
            <Checkbox checked={task.completed} onToggle={onToggle} size={24} />
            <View style={styles.taskInfo}>
              <Text
                variant="body"
                weight="medium"
                style={{
                  textDecorationLine: task.completed ? "line-through" : "none",
                  opacity: task.completed ? 0.6 : 1,
                }}
              >
                {task.title}
              </Text>
              {task.description && (
                <Text
                  variant="bodySmall"
                  color="textSecondary"
                  style={{
                    marginTop: theme.spacing.xs,
                    textDecorationLine: task.completed
                      ? "line-through"
                      : "none",
                    opacity: task.completed ? 0.6 : 1,
                  }}
                >
                  {task.description}
                </Text>
              )}
              <View style={styles.metaRow}>
                <Text variant="caption" color="textTertiary">
                  {formatDate(task.createdAt)}
                </Text>
                {task.syncStatus === "pending" && (
                  <View
                    style={[
                      styles.syncBadge,
                      {
                        backgroundColor: theme.colors.warning,
                        marginLeft: theme.spacing.sm,
                        paddingHorizontal: theme.spacing.sm,
                        paddingVertical: 2,
                        borderRadius: theme.borderRadius.sm,
                      },
                    ]}
                  >
                    <Text variant="caption" color="textInverse">
                      Pending Sync
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    position: "relative",
  },
  actionsContainer: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingRight: 8,
  },
  actionButton: {
    width: 60,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
    borderRadius: 8,
  },
  taskContent: {
    width: "100%",
  },
  taskRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  taskInfo: {
    flex: 1,
    marginLeft: 12,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  syncBadge: {
    flexDirection: "row",
    alignItems: "center",
  },
});
