// Custom hook for task operations

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import {
    addTask,
    clearError,
    deleteTask,
    loadTasks,
    selectActiveTasks,
    selectCompletedTasks,
    selectFilteredTasks,
    setFilter,
    toggleTaskComplete,
    updateTask,
} from '../store/slices/tasksSlice';
import { Task, TaskFilter } from '../utils/types';

export const useTasks = () => {
  const dispatch = useAppDispatch();
  const { tasks, isLoading, error, filter } = useAppSelector(state => state.tasks);
  const filteredTasks = useAppSelector(selectFilteredTasks);
  const activeTasks = useAppSelector(selectActiveTasks);
  const completedTasks = useAppSelector(selectCompletedTasks);

  const handleLoadTasks = useCallback(
    async (userId: string) => {
      return dispatch(loadTasks(userId)).unwrap();
    },
    [dispatch]
  );

  const handleAddTask = useCallback(
    async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
      return dispatch(addTask(task)).unwrap();
    },
    [dispatch]
  );

  const handleUpdateTask = useCallback(
    async (id: string, updates: Partial<Task>) => {
      return dispatch(updateTask({ id, updates })).unwrap();
    },
    [dispatch]
  );

  const handleDeleteTask = useCallback(
    async (id: string) => {
      return dispatch(deleteTask(id)).unwrap();
    },
    [dispatch]
  );

  const handleToggleComplete = useCallback(
    async (id: string) => {
      return dispatch(toggleTaskComplete(id)).unwrap();
    },
    [dispatch]
  );

  const handleSetFilter = useCallback(
    (newFilter: TaskFilter) => {
      dispatch(setFilter(newFilter));
    },
    [dispatch]
  );

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    tasks,
    filteredTasks,
    activeTasks,
    completedTasks,
    isLoading,
    error,
    filter,
    loadTasks: handleLoadTasks,
    addTask: handleAddTask,
    updateTask: handleUpdateTask,
    deleteTask: handleDeleteTask,
    toggleComplete: handleToggleComplete,
    setFilter: handleSetFilter,
    clearError: handleClearError,
  };
};
