// Tasks slice - Redux Toolkit

import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { sqliteService } from '../../services/database/sqlite';
import { Task, TaskFilter, TasksState } from '../../utils/types';
import { RootState } from '../index';

const initialState: TasksState = {
  tasks: [],
  isLoading: false,
  error: null,
  filter: TaskFilter.ALL,
};

// Async thunks
export const loadTasks = createAsyncThunk(
  'tasks/loadTasks',
  async (userId: string, { rejectWithValue }) => {
    try {
      const tasks = await sqliteService.getTasks(userId);
      return tasks;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load tasks');
    }
  }
);

export const addTask = createAsyncThunk(
  'tasks/addTask',
  async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const newTask = await sqliteService.createTask(task);
      return newTask;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add task');
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, updates }: { id: string; updates: Partial<Task> }, { rejectWithValue }) => {
    try {
      const updatedTask = await sqliteService.updateTask(id, updates);
      return updatedTask;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update task');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id: string, { rejectWithValue }) => {
    try {
      await sqliteService.deleteTask(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete task');
    }
  }
);

export const toggleTaskComplete = createAsyncThunk(
  'tasks/toggleTaskComplete',
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const task = state.tasks.tasks.find(t => t.id === id);
      if (!task) throw new Error('Task not found');
      
      const updatedTask = await sqliteService.updateTask(id, { 
        completed: !task.completed 
      });
      return updatedTask;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to toggle task');
    }
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<TaskFilter>) => {
      state.filter = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearTasks: (state) => {
      state.tasks = [];
    },
  },
  extraReducers: (builder) => {
    // Load Tasks
    builder.addCase(loadTasks.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loadTasks.fulfilled, (state, action) => {
      state.isLoading = false;
      state.tasks = action.payload;
    });
    builder.addCase(loadTasks.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Add Task
    builder.addCase(addTask.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(addTask.fulfilled, (state, action) => {
      state.isLoading = false;
      state.tasks.unshift(action.payload);
    });
    builder.addCase(addTask.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Update Task
    builder.addCase(updateTask.pending, (state) => {
      state.error = null;
    });
    builder.addCase(updateTask.fulfilled, (state, action) => {
      const index = state.tasks.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    });
    builder.addCase(updateTask.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    // Delete Task
    builder.addCase(deleteTask.pending, (state) => {
      state.error = null;
    });
    builder.addCase(deleteTask.fulfilled, (state, action) => {
      state.tasks = state.tasks.filter(t => t.id !== action.payload);
    });
    builder.addCase(deleteTask.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    // Toggle Complete
    builder.addCase(toggleTaskComplete.fulfilled, (state, action) => {
      const index = state.tasks.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    });
  },
});

// Selectors with memoization
export const selectAllTasks = (state: RootState) => state.tasks.tasks;
export const selectTasksFilter = (state: RootState) => state.tasks.filter;

export const selectFilteredTasks = createSelector(
  [selectAllTasks, selectTasksFilter],
  (tasks, filter) => {
    switch (filter) {
      case TaskFilter.ACTIVE:
        return tasks.filter(task => !task.completed);
      case TaskFilter.COMPLETED:
        return tasks.filter(task => task.completed);
      default:
        return tasks;
    }
  }
);

export const selectActiveTasks = createSelector(
  [selectAllTasks],
  (tasks) => tasks.filter(task => !task.completed)
);

export const selectCompletedTasks = createSelector(
  [selectAllTasks],
  (tasks) => tasks.filter(task => task.completed)
);

export const { setFilter, clearError, clearTasks } = tasksSlice.actions;
export default tasksSlice.reducer;
