// Application constants

export const APP_NAME = 'TaskManager';

// Database
export const DB_NAME = 'taskmanager.db';
export const DB_VERSION = 1;

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@auth_token',
  USER_DATA: '@user_data',
  THEME_MODE: '@theme_mode',
  FCM_TOKEN: '@fcm_token',
} as const;

// Firestore collections
export const COLLECTIONS = {
  USERS: 'users',
  TASKS: 'tasks',
} as const;

// Sync settings
export const SYNC_CONFIG = {
  MAX_RETRY_COUNT: 3,
  RETRY_DELAY_MS: 1000,
  BATCH_SIZE: 50,
} as const;

// Notification settings
export const NOTIFICATION_CONFIG = {
  CHANNEL_ID: 'task-reminders',
  CHANNEL_NAME: 'Task Reminders',
  CHANNEL_DESCRIPTION: 'Notifications for task reminders',
} as const;

// Performance settings
export const FLATLIST_CONFIG = {
  INITIAL_NUM_TO_RENDER: 10,
  MAX_TO_RENDER_PER_BATCH: 10,
  WINDOW_SIZE: 5,
  UPDATE_CELLS_BATCH_PERIOD: 50,
} as const;

// Validation
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_TASK_TITLE_LENGTH: 100,
  MAX_TASK_DESCRIPTION_LENGTH: 500,
} as const;

// Animation durations (ms)
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;
