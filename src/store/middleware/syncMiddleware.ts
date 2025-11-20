// Sync middleware - intercepts task actions and queues them for sync

import { Middleware } from '@reduxjs/toolkit';
import { generateId } from '../../utils/helpers';
import { SyncQueueItem } from '../../utils/types';
import { addToQueue } from '../slices/syncSlice';
import { addTask, deleteTask, updateTask } from '../slices/tasksSlice';

export const syncMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);

  // Check if we're offline and need to queue the operation
  const state = store.getState();
  
  // Queue task operations for sync
  if (addTask.fulfilled.match(action)) {
    const queueItem: SyncQueueItem = {
      id: generateId(),
      operation: 'create',
      data: action.payload,
      timestamp: Date.now(),
      retryCount: 0,
    };
    store.dispatch(addToQueue(queueItem));
  }

  if (updateTask.fulfilled.match(action)) {
    const queueItem: SyncQueueItem = {
      id: generateId(),
      operation: 'update',
      data: action.payload,
      timestamp: Date.now(),
      retryCount: 0,
    };
    store.dispatch(addToQueue(queueItem));
  }

  if (deleteTask.fulfilled.match(action)) {
    const queueItem: SyncQueueItem = {
      id: generateId(),
      operation: 'delete',
      data: { id: action.payload },
      timestamp: Date.now(),
      retryCount: 0,
    };
    store.dispatch(addToQueue(queueItem));
  }

  return result;
};
