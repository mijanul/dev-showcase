// SQLite Service - Local database operations

import * as SQLite from 'expo-sqlite';
import { DB_NAME } from '../../utils/constants';
import { generateId } from '../../utils/helpers';
import { SyncQueueItem, SyncStatus, Task } from '../../utils/types';
import { MIGRATIONS, SCHEMA_VERSION } from './schema';

class SQLiteService {
  private db: SQLite.SQLiteDatabase | null = null;

  /**
   * Initialize database and run migrations
   */
  async initialize(): Promise<void> {
    try {
      this.db = await SQLite.openDatabaseAsync(DB_NAME);
      await this.runMigrations();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  /**
   * Run database migrations
   */
  private async runMigrations(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      // Get current schema version
      const result = await this.db.getFirstAsync<{ user_version: number }>(
        'PRAGMA user_version'
      );
      const currentVersion = result?.user_version || 0;

      // Run migrations
      for (let version = currentVersion + 1; version <= SCHEMA_VERSION; version++) {
        const migrations = MIGRATIONS[version];
        if (migrations) {
          for (const migration of migrations) {
            await this.db.execAsync(migration);
          }
          await this.db.execAsync(`PRAGMA user_version = ${version}`);
          console.log(`Migrated to version ${version}`);
        }
      }
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }
  }

  /**
   * Get all tasks for a user
   */
  async getTasks(userId: string): Promise<Task[]> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const rows = await this.db.getAllAsync<any>(
        'SELECT * FROM tasks WHERE userId = ? ORDER BY createdAt DESC',
        [userId]
      );

      return rows.map(row => ({
        id: row.id,
        userId: row.userId,
        title: row.title,
        description: row.description,
        completed: Boolean(row.completed),
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        reminderAt: row.reminderAt,
        syncStatus: row.syncStatus as SyncStatus,
      }));
    } catch (error) {
      console.error('Failed to get tasks:', error);
      throw error;
    }
  }

  /**
   * Create a new task
   */
  async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const id = generateId();
      const now = Date.now();

      const newTask: Task = {
        ...task,
        id,
        createdAt: now,
        updatedAt: now,
        syncStatus: SyncStatus.PENDING,
      };

      await this.db.runAsync(
        `INSERT INTO tasks (id, userId, title, description, completed, createdAt, updatedAt, reminderAt, syncStatus)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newTask.id,
          newTask.userId,
          newTask.title,
          newTask.description || null,
          newTask.completed ? 1 : 0,
          newTask.createdAt,
          newTask.updatedAt,
          newTask.reminderAt || null,
          newTask.syncStatus,
        ]
      );

      return newTask;
    } catch (error) {
      console.error('Failed to create task:', error);
      throw error;
    }
  }

  /**
   * Update a task
   */
  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const now = Date.now();
      const fields: string[] = [];
      const values: any[] = [];

      // Build dynamic update query
      Object.entries(updates).forEach(([key, value]) => {
        if (key !== 'id' && key !== 'createdAt') {
          fields.push(`${key} = ?`);
          if (key === 'completed') {
            values.push(value ? 1 : 0);
          } else {
            values.push(value);
          }
        }
      });

      fields.push('updatedAt = ?');
      values.push(now);

      fields.push('syncStatus = ?');
      values.push(SyncStatus.PENDING);

      values.push(id);

      await this.db.runAsync(
        `UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`,
        values
      );

      // Fetch and return updated task
      const updatedTask = await this.db.getFirstAsync<any>(
        'SELECT * FROM tasks WHERE id = ?',
        [id]
      );

      if (!updatedTask) throw new Error('Task not found after update');

      return {
        id: updatedTask.id,
        userId: updatedTask.userId,
        title: updatedTask.title,
        description: updatedTask.description,
        completed: Boolean(updatedTask.completed),
        createdAt: updatedTask.createdAt,
        updatedAt: updatedTask.updatedAt,
        reminderAt: updatedTask.reminderAt,
        syncStatus: updatedTask.syncStatus as SyncStatus,
      };
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error;
    }
  }

  /**
   * Delete a task
   */
  async deleteTask(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      await this.db.runAsync('DELETE FROM tasks WHERE id = ?', [id]);
    } catch (error) {
      console.error('Failed to delete task:', error);
      throw error;
    }
  }

  /**
   * Get pending sync items
   */
  async getPendingSyncTasks(userId: string): Promise<Task[]> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const rows = await this.db.getAllAsync<any>(
        'SELECT * FROM tasks WHERE userId = ? AND syncStatus = ?',
        [userId, SyncStatus.PENDING]
      );

      return rows.map(row => ({
        id: row.id,
        userId: row.userId,
        title: row.title,
        description: row.description,
        completed: Boolean(row.completed),
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        reminderAt: row.reminderAt,
        syncStatus: row.syncStatus as SyncStatus,
      }));
    } catch (error) {
      console.error('Failed to get pending sync tasks:', error);
      throw error;
    }
  }

  /**
   * Update task sync status
   */
  async updateTaskSyncStatus(id: string, status: SyncStatus): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      await this.db.runAsync(
        'UPDATE tasks SET syncStatus = ? WHERE id = ?',
        [status, id]
      );
    } catch (error) {
      console.error('Failed to update sync status:', error);
      throw error;
    }
  }

  /**
   * Add item to sync queue
   */
  async addToSyncQueue(item: SyncQueueItem): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      await this.db.runAsync(
        `INSERT INTO sync_queue (id, operation, data, timestamp, retryCount)
         VALUES (?, ?, ?, ?, ?)`,
        [item.id, item.operation, JSON.stringify(item.data), item.timestamp, item.retryCount]
      );
    } catch (error) {
      console.error('Failed to add to sync queue:', error);
      throw error;
    }
  }

  /**
   * Get all sync queue items
   */
  async getSyncQueue(): Promise<SyncQueueItem[]> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const rows = await this.db.getAllAsync<any>(
        'SELECT * FROM sync_queue ORDER BY timestamp ASC'
      );

      return rows.map(row => ({
        id: row.id,
        operation: row.operation,
        data: JSON.parse(row.data),
        timestamp: row.timestamp,
        retryCount: row.retryCount,
      }));
    } catch (error) {
      console.error('Failed to get sync queue:', error);
      throw error;
    }
  }

  /**
   * Remove item from sync queue
   */
  async removeFromSyncQueue(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      await this.db.runAsync('DELETE FROM sync_queue WHERE id = ?', [id]);
    } catch (error) {
      console.error('Failed to remove from sync queue:', error);
      throw error;
    }
  }

  /**
   * Clear all data (for logout)
   */
  async clearAllData(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      await this.db.execAsync('DELETE FROM tasks');
      await this.db.execAsync('DELETE FROM sync_queue');
    } catch (error) {
      console.error('Failed to clear data:', error);
      throw error;
    }
  }
}

export const sqliteService = new SQLiteService();
