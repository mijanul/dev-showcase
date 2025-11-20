import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Alert, Modal, Pressable, StyleSheet, View } from 'react-native';
import { Button } from '../../src/atoms/Button';
import { Text } from '../../src/atoms/Text';
import { useAuth } from '../../src/hooks/useAuth';
import { useNetworkStatus } from '../../src/hooks/useNetworkStatus';
import { useOfflineSync } from '../../src/hooks/useOfflineSync';
import { useTasks } from '../../src/hooks/useTasks';
import { useTheme } from '../../src/hooks/useTheme';
import { FormField } from '../../src/molecules/FormField';
import { TaskList } from '../../src/organisms/TaskList';
import { Task, TaskFilter } from '../../src/utils/types';

export default function TasksScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const {
    filteredTasks,
    isLoading,
    loadTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    filter,
    setFilter,
  } = useTasks();
  const { isSyncing, hasPendingChanges, sync } = useOfflineSync(user?.uid || null);
  const { isOnline } = useNetworkStatus();

  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      loadTasks(user.uid);
    }
  }, [user]);

  const handleRefresh = async () => {
    if (!user) return;
    setIsRefreshing(true);
    try {
      await loadTasks(user.uid);
      if (isOnline) {
        await sync();
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleAddTask = async () => {
    if (!user || !taskTitle.trim()) return;

    try {
      await addTask({
        userId: user.uid,
        title: taskTitle.trim(),
        description: taskDescription.trim() || undefined,
        completed: false,
        syncStatus: 'pending' as any,
      });
      setTaskTitle('');
      setTaskDescription('');
      setIsAddModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to add task');
    }
  };

  const handleEditTask = async () => {
    if (!selectedTask || !taskTitle.trim()) return;

    try {
      await updateTask(selectedTask.id, {
        title: taskTitle.trim(),
        description: taskDescription.trim() || undefined,
      });
      setTaskTitle('');
      setTaskDescription('');
      setSelectedTask(null);
      setIsEditModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update task');
    }
  };

  const handleDeleteTask = (id: string) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTask(id);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete task');
            }
          },
        },
      ]
    );
  };

  const openEditModal = (task: Task) => {
    setSelectedTask(task);
    setTaskTitle(task.title);
    setTaskDescription(task.description || '');
    setIsEditModalVisible(true);
  };

  const closeModals = () => {
    setIsAddModalVisible(false);
    setIsEditModalVisible(false);
    setTaskTitle('');
    setTaskDescription('');
    setSelectedTask(null);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Status Bar */}
      <View
        style={[
          styles.statusBar,
          {
            backgroundColor: theme.colors.backgroundSecondary,
            padding: theme.spacing.sm,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
          },
        ]}
      >
        <View style={styles.statusRow}>
          <View style={styles.statusItem}>
            <Ionicons
              name={isOnline ? 'cloud-done' : 'cloud-offline'}
              size={16}
              color={isOnline ? theme.colors.success : theme.colors.error}
            />
            <Text variant="caption" color="textSecondary" style={{ marginLeft: 4 }}>
              {isOnline ? 'Online' : 'Offline'}
            </Text>
          </View>
          {hasPendingChanges && (
            <View style={styles.statusItem}>
              <Ionicons name="sync" size={16} color={theme.colors.warning} />
              <Text variant="caption" color="textSecondary" style={{ marginLeft: 4 }}>
                {isSyncing ? 'Syncing...' : 'Pending sync'}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Filter Buttons */}
      <View
        style={[
          styles.filterContainer,
          {
            padding: theme.spacing.base,
            backgroundColor: theme.colors.backgroundSecondary,
          },
        ]}
      >
        ]}>
        <Pressable
          style={[
            styles.filterButton,
            {
              backgroundColor: filter === TaskFilter.ALL ? theme.colors.primary : 'transparent',
              paddingHorizontal: theme.spacing.base,
              paddingVertical: theme.spacing.sm,
              borderRadius: theme.borderRadius.base,
              marginRight: theme.spacing.sm,
            },
          ]}
          onPress={() => setFilter(TaskFilter.ALL)}
        >
          <Text
            variant="bodySmall"
            weight="medium"
            style={{ color: filter === TaskFilter.ALL ? theme.colors.textInverse : theme.colors.text }}
          >
            All
          </Text>
        </Pressable>
        <Pressablee
          style={[
            styles.filterButton,
            {
              backgroundColor: filter === TaskFilter.ACTIVE ? theme.colors.primary : 'transparent',
              paddingHorizontal: theme.spacing.base,
              paddingVertical: theme.spacing.sm,
              borderRadius: theme.borderRadius.base,
              marginRight: theme.spacing.sm,
            },
          ]}
          onPress={() => setFilter(TaskFilter.ACTIVE)}
        >
          <Text
            variant="bodySmall"
            weight="medium"
            style={{ color: filter === TaskFilter.ACTIVE ? theme.colors.textInverse : theme.colors.text }}
          >
            Active
          </Text>
        </Pressable>
        <Pressable
                <Pressable
          style={[
            styles.filterButton,
            {
              backgroundColor: filter === TaskFilter.COMPLETED ? theme.colors.primary : 'transparent',
              paddingHorizontal: theme.spacing.base,
              paddingVertical: theme.spacing.sm,
              borderRadius: theme.borderRadius.base,
            },
          ]}
          onPress={() => setFilter(TaskFilter.COMPLETED)}
        >
          <Text
            variant="bodySmall"
            weight="medium"
            style={{ color: filter === TaskFilter.COMPLETED ? theme.colors.textInverse : theme.colors.text }}
          >
            Completed
          </Text>
        </Pressable>
      </View>
      </View>

      {/* Task List */}
      <TaskList
        tasks={filteredTasks}
        onToggle={toggleComplete}
        onEdit={openEditModal}
        onDelete={handleDeleteTask}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* Add Task Button */}
      <Pressable
        style={[
          styles.fab,
          {
            backgroundColor: theme.colors.primary,
            ...theme.shadows.lg,
          },
        ]}
        onPress={() => setIsAddModalVisible(true)}
      >
        <Ionicons name="add" size={32} color={theme.colors.textInverse} />
      </Pressable>

      {/* Add Task Modal */}
      <Modal
        visible={isAddModalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeModals}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: theme.colors.surface,
                borderRadius: theme.borderRadius.lg,
                padding: theme.spacing.xl,
              },
            ]}
          >
            <Text variant="h3" weight="bold" style={{ marginBottom: theme.spacing.lg }}>
              Add New Task
            </Text>
            <FormField
              label="Title"
              value={taskTitle}
              onChangeText={setTaskTitle}
              placeholder="Enter task title"
            />
            <FormField
              label="Description (Optional)"
              value={taskDescription}
              onChangeText={setTaskDescription}
              placeholder="Enter task description"
              multiline
              numberOfLines={3}
            />
            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                onPress={closeModals}
                variant="outline"
                style={{ flex: 1, marginRight: theme.spacing.sm }}
              />
              <Button
                title="Add"
                onPress={handleAddTask}
                style={{ flex: 1 }}
                disabled={!taskTitle.trim()}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeModals}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: theme.colors.surface,
                borderRadius: theme.borderRadius.lg,
                padding: theme.spacing.xl,
              },
            ]}
          >
            <Text variant="h3" weight="bold" style={{ marginBottom: theme.spacing.lg }}>
              Edit Task
            </Text>
            <FormField
              label="Title"
              value={taskTitle}
              onChangeText={setTaskTitle}
              placeholder="Enter task title"
            />
            <FormField
              label="Description (Optional)"
              value={taskDescription}
              onChangeText={setTaskDescription}
              placeholder="Enter task description"
              multiline
              numberOfLines={3}
            />
            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                onPress={closeModals}
                variant="outline"
                style={{ flex: 1, marginRight: theme.spacing.sm }}
              />
              <Button
                title="Save"
                onPress={handleEditTask}
                style={{ flex: 1 }}
                disabled={!taskTitle.trim()}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  filterContainer: {
    flexDirection: 'row',
  },
  filterButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 500,
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 16,
  },
});
