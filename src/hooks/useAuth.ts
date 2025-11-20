// Custom hook for authentication

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { checkSession, clearError, login, logout, signUp } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading, error } = useAppSelector(state => state.auth);

  const handleSignUp = useCallback(
    async (email: string, password: string) => {
      return dispatch(signUp({ email, password })).unwrap();
    },
    [dispatch]
  );

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      return dispatch(login({ email, password })).unwrap();
    },
    [dispatch]
  );

  const handleLogout = useCallback(async () => {
    return dispatch(logout()).unwrap();
  }, [dispatch]);

  const handleCheckSession = useCallback(async () => {
    return dispatch(checkSession()).unwrap();
  }, [dispatch]);

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    signUp: handleSignUp,
    login: handleLogin,
    logout: handleLogout,
    checkSession: handleCheckSession,
    clearError: handleClearError,
  };
};
