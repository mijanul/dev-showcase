// TaskList Component - Organism

import React, { useCallback } from 'react';
import { FlatList, ListRenderItem, RefreshControl } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { EmptyState } from '../../molecules/EmptyState';
import { TaskItem } from '../../molecules/TaskItem';
import { FLATLIST_CONFIG } from '../../utils/constants';
import { Task } from '../../utils/types';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggle,
  onEdit,
  onDelete,
  onRefresh,
  isRefreshing = false,
  emptyTitle = 'No tasks yet',
  emptyDescription = 'Create your first task to get started',
}) => {
  const { theme } = useTheme();

  const renderItem: ListRenderItem<Task> = useCallback(
    ({ item }) => (
      <TaskItem
        task={item}
        onToggle={() => onToggle(item.id)}
        onEdit={() => onEdit(item)}
        onDelete={() => onDelete(item.id)}
      />
    ),
    [onToggle, onEdit, onDelete]
  );

  const keyExtractor = useCallback((item: Task) => item.id, []);

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: 80, // Approximate item height
      offset: 80 * index,
      index,
    }),
    []
  );

  const ListEmptyComponent = useCallback(
    () => (
      <EmptyState
        icon="checkbox-outline"
        title={emptyTitle}
        description={emptyDescription}
      />
    ),
    [emptyTitle, emptyDescription]
  );

  return (
    <FlatList
      data={tasks}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={{
        padding: theme.spacing.base,
        flexGrow: 1,
      }}
      // Performance optimizations
      getItemLayout={getItemLayout}
      initialNumToRender={FLATLIST_CONFIG.INITIAL_NUM_TO_RENDER}
      maxToRenderPerBatch={FLATLIST_CONFIG.MAX_TO_RENDER_PER_BATCH}
      windowSize={FLATLIST_CONFIG.WINDOW_SIZE}
      updateCellsBatchingPeriod={FLATLIST_CONFIG.UPDATE_CELLS_BATCH_PERIOD}
      removeClippedSubviews={true}
      // Pull to refresh
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        ) : undefined
      }
      // Empty state
      ListEmptyComponent={ListEmptyComponent}
    />
  );
};
