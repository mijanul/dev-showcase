// Sync Service - Handles offline/online synchronization

import * as Network from 'expo-network';
import { SYNC_CONFIG } from '../../utils/constants';
import { getBackoffDelay } from '../../utils/helpers';
import { SyncQueueItem, SyncStatus, Task } from '../../utils/types';
import { sqliteService } from '../database/sqlite';
import { firestoreService } from '../firebase/firestoreService';

class SyncService {
  private isSyncing = false;
  private syncListeners: Array<(status: boolean) => void> = [];

  /**
   * Sync all pending changes
   */
  async syncAll(userId: string): Promise<void> {
    if (this.isSyncing) {
      console.log('Sync already in progress');
      return;
    }

    try {
      this.isSyncing = true;
      this.notifySyncListeners(true);

      // Check network connectivity
      const networkState = await Network.getNetworkStateAsync();
      if (!networkState.isConnected || !networkState.isInternetReachable) {
        throw new Error('No internet connection');
      }

      // Get pending tasks from local database
      const pendingTasks = await sqliteService.getPendingSyncTasks(userId);

      if (pendingTasks.length === 0) {
        console.log('No pending tasks to sync');
        return;
      }

      // Sync tasks in batches
      await this.syncTasksBatch(pendingTasks);

      // Pull remote changes
      await this.pullRemoteChanges(userId);

      console.log(`Successfully synced ${pendingTasks.length} tasks`);
    } catch (error) {
      console.error('Sync failed:', error);
      throw error;
    } finally {
      this.isSyncing = false;
      this.notifySyncListeners(false);
    }
  }

  /**
   * Sync tasks in batches
   */
  private async syncTasksBatch(tasks: Task[]): Promise<void> {
    const batches: Task[][] = [];
    
    // Split into batches
    for (let i = 0; i < tasks.length; i += SYNC_CONFIG.BATCH_SIZE) {
      batches.push(tasks.slice(i, i + SYNC_CONFIG.BATCH_SIZE));
    }

    // Process each batch
    for (const batch of batches) {
      try {
        await firestoreService.batchSyncTasks(batch);
        
        // Update sync status in local database
        for (const task of batch) {
          await sqliteService.updateTaskSyncStatus(task.id, SyncStatus.SYNCED);
        }
      } catch (error) {
        console.error('Batch sync failed:', error);
        
        // Mark as error
        for (const task of batch) {
          await sqliteService.updateTaskSyncStatus(task.id, SyncStatus.ERROR);
        }
        
        throw error;
      }
    }
  }

  /**
   * Pull remote changes and merge with local
   */
  private async pullRemoteChanges(userId: string): Promise<void> {
    try {
      const remoteTasks = await firestoreService.getTasks(userId);
      const localTasks = await sqliteService.getTasks(userId);

      // Create a map of local tasks for quick lookup
      const localTasksMap = new Map(localTasks.map(task => [task.id, task]));

      for (const remoteTask of remoteTasks) {
        const localTask = localTasksMap.get(remoteTask.id);

        if (!localTask) {
          // Task exists remotely but not locally - create it
          await sqliteService.createTask({
            ...remoteTask,
            syncStatus: SyncStatus.SYNCED,
          });
        } else if (remoteTask.updatedAt > localTask.updatedAt) {
          // Remote task is newer - update local (conflict resolution: last-write-wins)
          await sqliteService.updateTask(remoteTask.id, {
            ...remoteTask,
            syncStatus: SyncStatus.SYNCED,
          });
        }
        // If local is newer, it will be synced in the next cycle
      }
    } catch (error) {
      console.error('Failed to pull remote changes:', error);
      throw error;
    }
  }

  /**
   * Sync a single task
   */
  async syncTask(task: Task): Promise<void> {
    try {
      const networkState = await Network.getNetworkStateAsync();
      if (!networkState.isConnected || !networkState.isInternetReachable) {
        console.log('Offline - task will be synced later');
        return;
      }

      await firestoreService.createTask(task);
      await sqliteService.updateTaskSyncStatus(task.id, SyncStatus.SYNCED);
    } catch (error) {
      console.error('Failed to sync task:', error);
      await sqliteService.updateTaskSyncStatus(task.id, SyncStatus.ERROR);
      throw error;
    }
  }

  /**
   * Retry failed syncs with exponential backoff
   */
  async retryFailedSyncs(userId: string): Promise<void> {
    const queue = await sqliteService.getSyncQueue();

    for (const item of queue) {
      if (item.retryCount >= SYNC_CONFIG.MAX_RETRY_COUNT) {
        console.log(`Max retries reached for item ${item.id}`);
        continue;
      }

      const delay = getBackoffDelay(item.retryCount, SYNC_CONFIG.RETRY_DELAY_MS);
      await new Promise(resolve => setTimeout(resolve, delay));

      try {
        await this.processSyncQueueItem(item);
        await sqliteService.removeFromSyncQueue(item.id);
      } catch (error) {
        console.error(`Retry failed for item ${item.id}:`, error);
        // Increment retry count would go here
      }
    }
  }

  /**
   * Process a single sync queue item
   */
  private async processSyncQueueItem(item: SyncQueueItem): Promise<void> {
    switch (item.operation) {
      case 'create':
        await firestoreService.createTask(item.data as Task);
        break;
      case 'update':
        await firestoreService.updateTask(item.data.id!, item.data);
        break;
      case 'delete':
        await firestoreService.deleteTask(item.data.id!);
        break;
    }
  }

  /**
   * Check if online
   */
  async isOnline(): Promise<boolean> {
    try {
      const networkState = await Network.getNetworkStateAsync();
      return networkState.isConnected === true && networkState.isInternetReachable === true;
    } catch (error) {
      console.error('Failed to check network status:', error);
      return false;
    }
  }

  /**
   * Add sync listener
   */
  addSyncListener(listener: (status: boolean) => void): () => void {
    this.syncListeners.push(listener);
    return () => {
      this.syncListeners = this.syncListeners.filter(l => l !== listener);
    };
  }

  /**
   * Notify sync listeners
   */
  private notifySyncListeners(status: boolean): void {
    this.syncListeners.forEach(listener => listener(status));
  }
}

export const syncService = new SyncService();
