// Type definitions for the application

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: number;
  updatedAt: number;
  reminderAt?: number;
  syncStatus: SyncStatus;
}

export enum SyncStatus {
  SYNCED = 'synced',
  PENDING = 'pending',
  SYNCING = 'syncing',
  ERROR = 'error',
}

export interface SyncQueueItem {
  id: string;
  operation: 'create' | 'update' | 'delete';
  data: Partial<Task>;
  timestamp: number;
  retryCount: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface TasksState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  filter: TaskFilter;
}

export enum TaskFilter {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

export interface SyncState {
  queue: SyncQueueItem[];
  isSyncing: boolean;
  lastSyncAt: number | null;
  error: string | null;
}

export interface ThemeState {
  mode: 'light' | 'dark';
}

export interface RootState {
  auth: AuthState;
  tasks: TasksState;
  sync: SyncState;
  theme: ThemeState;
}

// Environment config types
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export interface AppConfig {
  environment: 'development' | 'staging' | 'production';
  firebase: FirebaseConfig;
  apiBaseUrl: string;
  enableAnalytics: boolean;
  enableCrashReporting: boolean;
}
