// Sync slice - Redux Toolkit

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { syncService } from '../../services/sync/syncService';
import { SyncQueueItem, SyncState } from '../../utils/types';

const initialState: SyncState = {
  queue: [],
  isSyncing: false,
  lastSyncAt: null,
  error: null,
};

// Async thunks
export const syncTasks = createAsyncThunk(
  'sync/syncTasks',
  async (userId: string, { rejectWithValue }) => {
    try {
      await syncService.syncAll(userId);
      return Date.now();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Sync failed');
    }
  }
);

const syncSlice = createSlice({
  name: 'sync',
  initialState,
  reducers: {
    addToQueue: (state, action: PayloadAction<SyncQueueItem>) => {
      state.queue.push(action.payload);
    },
    removeFromQueue: (state, action: PayloadAction<string>) => {
      state.queue = state.queue.filter(item => item.id !== action.payload);
    },
    clearQueue: (state) => {
      state.queue = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(syncTasks.pending, (state) => {
      state.isSyncing = true;
      state.error = null;
    });
    builder.addCase(syncTasks.fulfilled, (state, action) => {
      state.isSyncing = false;
      state.lastSyncAt = action.payload;
      state.queue = [];
    });
    builder.addCase(syncTasks.rejected, (state, action) => {
      state.isSyncing = false;
      state.error = action.payload as string;
    });
  },
});

export const { addToQueue, removeFromQueue, clearQueue, clearError } = syncSlice.actions;
export default syncSlice.reducer;
