// Custom hook for network status monitoring

import * as Network from 'expo-network';
import { useEffect, useState } from 'react';

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkNetworkStatus();

    // Check network status periodically
    const interval = setInterval(checkNetworkStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  const checkNetworkStatus = async () => {
    try {
      const networkState = await Network.getNetworkStateAsync();
      const online = networkState.isConnected === true && networkState.isInternetReachable === true;
      setIsOnline(online);
    } catch (error) {
      console.error('Failed to check network status:', error);
      setIsOnline(false);
    } finally {
      setIsChecking(false);
    }
  };

  return { isOnline, isChecking, refresh: checkNetworkStatus };
};
