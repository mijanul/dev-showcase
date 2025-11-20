// SQLite Database Schema

export const SCHEMA_VERSION = 1;

// SQL statements for creating tables
export const CREATE_TASKS_TABLE = `
  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY NOT NULL,
    userId TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    completed INTEGER NOT NULL DEFAULT 0,
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL,
    reminderAt INTEGER,
    syncStatus TEXT NOT NULL DEFAULT 'pending'
  );
`;

export const CREATE_SYNC_QUEUE_TABLE = `
  CREATE TABLE IF NOT EXISTS sync_queue (
    id TEXT PRIMARY KEY NOT NULL,
    operation TEXT NOT NULL,
    data TEXT NOT NULL,
    timestamp INTEGER NOT NULL,
    retryCount INTEGER NOT NULL DEFAULT 0
  );
`;

// Indexes for better query performance
export const CREATE_TASKS_INDEXES = `
  CREATE INDEX IF NOT EXISTS idx_tasks_userId ON tasks(userId);
  CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);
  CREATE INDEX IF NOT EXISTS idx_tasks_syncStatus ON tasks(syncStatus);
  CREATE INDEX IF NOT EXISTS idx_tasks_createdAt ON tasks(createdAt DESC);
`;

export const CREATE_SYNC_QUEUE_INDEXES = `
  CREATE INDEX IF NOT EXISTS idx_sync_queue_timestamp ON sync_queue(timestamp);
`;

// Migration queries (for future versions)
export const MIGRATIONS: Record<number, string[]> = {
  1: [
    CREATE_TASKS_TABLE,
    CREATE_SYNC_QUEUE_TABLE,
    CREATE_TASKS_INDEXES,
    CREATE_SYNC_QUEUE_INDEXES,
  ],
  // Future migrations will go here
  // 2: ['ALTER TABLE tasks ADD COLUMN newField TEXT;'],
};
