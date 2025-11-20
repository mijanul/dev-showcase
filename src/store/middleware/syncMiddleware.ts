// Sync middleware - intercepts task actions and queues them for sync when offline

import { Middleware } from "@reduxjs/toolkit";
import * as Network from "expo-network";
import { generateId } from "../../utils/helpers";
import { SyncQueueItem } from "../../utils/types";
import { addToQueue } from "../slices/syncSlice";
import {
  addTask,
  deleteTask,
  toggleTaskComplete,
  updateTask,
} from "../slices/tasksSlice";

export const syncMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);

  // For task mutation actions (pending), check network status and queue if offline
  if (
    addTask.pending.match(action) ||
    updateTask.pending.match(action) ||
    deleteTask.pending.match(action) ||
    toggleTaskComplete.pending.match(action)
  ) {
    // Queue for sync if offline (async operation, won't block the action)
    (async () => {
      try {
        const networkState = await Network.getNetworkStateAsync();
        const isOnline =
          networkState.isConnected === true &&
          networkState.isInternetReachable === true;

        if (!isOnline) {
          let queueItem: SyncQueueItem | null = null;

          if (addTask.pending.match(action)) {
            queueItem = {
              id: generateId(),
              operation: "create",
              data: action.meta.arg,
              timestamp: Date.now(),
              retryCount: 0,
            };
          }

          if (updateTask.pending.match(action)) {
            queueItem = {
              id: generateId(),
              operation: "update",
              data: { id: action.meta.arg.id, ...action.meta.arg.updates },
              timestamp: Date.now(),
              retryCount: 0,
            };
          }

          if (toggleTaskComplete.pending.match(action)) {
            queueItem = {
              id: generateId(),
              operation: "update",
              data: { id: action.meta.arg },
              timestamp: Date.now(),
              retryCount: 0,
            };
          }

          if (deleteTask.pending.match(action)) {
            queueItem = {
              id: generateId(),
              operation: "delete",
              data: { id: action.meta.arg },
              timestamp: Date.now(),
              retryCount: 0,
            };
          }

          if (queueItem) {
            store.dispatch(addToQueue(queueItem));
          }
        }
      } catch (error) {
        console.error("Network check failed in middleware:", error);
      }
    })();
  }

  return result;
};
