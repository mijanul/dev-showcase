// Firestore Service - Cloud database operations

import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    setDoc,
    updateDoc,
    where,
    writeBatch
} from 'firebase/firestore';
import { COLLECTIONS } from '../../utils/constants';
import { SyncStatus, Task } from '../../utils/types';
import { firestore } from './firebaseConfig';

class FirestoreService {
  /**
   * Get all tasks for a user
   */
  async getTasks(userId: string): Promise<Task[]> {
    try {
      const tasksRef = collection(firestore, COLLECTIONS.TASKS);
      const q = query(
        tasksRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const tasks: Task[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        tasks.push({
          id: doc.id,
          userId: data.userId,
          title: data.title,
          description: data.description,
          completed: data.completed,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          reminderAt: data.reminderAt,
          syncStatus: SyncStatus.SYNCED,
        });
      });

      return tasks;
    } catch (error) {
      console.error('Failed to get tasks from Firestore:', error);
      throw error;
    }
  }

  /**
   * Create a task in Firestore
   */
  async createTask(task: Task): Promise<void> {
    try {
      const taskRef = doc(firestore, COLLECTIONS.TASKS, task.id);
      await setDoc(taskRef, {
        userId: task.userId,
        title: task.title,
        description: task.description || null,
        completed: task.completed,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        reminderAt: task.reminderAt || null,
      });
    } catch (error) {
      console.error('Failed to create task in Firestore:', error);
      throw error;
    }
  }

  /**
   * Update a task in Firestore
   */
  async updateTask(id: string, updates: Partial<Task>): Promise<void> {
    try {
      const taskRef = doc(firestore, COLLECTIONS.TASKS, id);
      
      // Remove fields that shouldn't be updated
      const { id: _, syncStatus, ...updateData } = updates as any;
      
      await updateDoc(taskRef, {
        ...updateData,
        updatedAt: Date.now(),
      });
    } catch (error) {
      console.error('Failed to update task in Firestore:', error);
      throw error;
    }
  }

  /**
   * Delete a task from Firestore
   */
  async deleteTask(id: string): Promise<void> {
    try {
      const taskRef = doc(firestore, COLLECTIONS.TASKS, id);
      await deleteDoc(taskRef);
    } catch (error) {
      console.error('Failed to delete task from Firestore:', error);
      throw error;
    }
  }

  /**
   * Batch sync tasks to Firestore
   */
  async batchSyncTasks(tasks: Task[]): Promise<void> {
    try {
      const batch = writeBatch(firestore);

      tasks.forEach((task) => {
        const taskRef = doc(firestore, COLLECTIONS.TASKS, task.id);
        batch.set(taskRef, {
          userId: task.userId,
          title: task.title,
          description: task.description || null,
          completed: task.completed,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
          reminderAt: task.reminderAt || null,
        });
      });

      await batch.commit();
    } catch (error) {
      console.error('Failed to batch sync tasks:', error);
      throw error;
    }
  }

  /**
   * Listen to real-time task updates
   */
  subscribeToTasks(
    userId: string,
    callback: (tasks: Task[]) => void
  ): () => void {
    const tasksRef = collection(firestore, COLLECTIONS.TASKS);
    const q = query(
      tasksRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const tasks: Task[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          tasks.push({
            id: doc.id,
            userId: data.userId,
            title: data.title,
            description: data.description,
            completed: data.completed,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            reminderAt: data.reminderAt,
            syncStatus: SyncStatus.SYNCED,
          });
        });
        callback(tasks);
      },
      (error) => {
        console.error('Firestore subscription error:', error);
      }
    );

    return unsubscribe;
  }

  /**
   * Get a single task
   */
  async getTask(id: string): Promise<Task | null> {
    try {
      const taskRef = doc(firestore, COLLECTIONS.TASKS, id);
      const taskDoc = await getDoc(taskRef);

      if (!taskDoc.exists()) {
        return null;
      }

      const data = taskDoc.data();
      return {
        id: taskDoc.id,
        userId: data.userId,
        title: data.title,
        description: data.description,
        completed: data.completed,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        reminderAt: data.reminderAt,
        syncStatus: SyncStatus.SYNCED,
      };
    } catch (error) {
      console.error('Failed to get task from Firestore:', error);
      throw error;
    }
  }
}

export const firestoreService = new FirestoreService();
