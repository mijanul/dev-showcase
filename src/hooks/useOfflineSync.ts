// Custom hook for offline sync operations

import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { syncTasks } from '../store/slices/syncSlice';
import { useNetworkStatus } from './useNetworkStatus';

export const useOfflineSync = (userId: string | null) => {
  const dispatch = useAppDispatch();
  const { queue, isSyncing, lastSyncAt, error } = useAppSelector(state => state.sync);
  const { isOnline } = useNetworkStatus();

  // Auto-sync when coming back online
  useEffect(() => {
    if (isOnline && userId && queue.length > 0 && !isSyncing) {
      handleSync();
    }
  }, [isOnline, userId, queue.length]);

  const handleSync = useCallback(async () => {
    if (!userId) return;
    
    try {
      await dispatch(syncTasks(userId)).unwrap();
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }, [dispatch, userId]);

  const hasPendingChanges = queue.length > 0;

  return {
    isSyncing,
    lastSyncAt,
    error,
    hasPendingChanges,
    sync: handleSync,
  };
};
