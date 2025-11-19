import * as SQLite from "expo-sqlite";
import { passwordUtils } from "./password-utils";

export interface UserData {
  id?: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  password: string;
  createdAt: number;
  updatedAt: number;
}

// Re-export passwordUtils for convenience
export { passwordUtils };

class Database {
  private db: SQLite.SQLiteDatabase | null = null;

  async init() {
    try {
      this.db = await SQLite.openDatabaseAsync("devshowcase.db");
      await this.createTables();
    } catch (error) {
      console.error("Error initializing database:", error);
      throw error;
    }
  }

  private async createTables() {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        phoneNumber TEXT,
        password TEXT NOT NULL,
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL
      );
    `);
  }

  async saveUser(userData: Omit<UserData, "id">): Promise<number> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    try {
      const result = await this.db.runAsync(
        `INSERT INTO users (email, firstName, lastName, phoneNumber, password, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          userData.email,
          userData.firstName,
          userData.lastName,
          userData.phoneNumber || null,
          userData.password,
          userData.createdAt,
          userData.updatedAt,
        ]
      );

      return result.lastInsertRowId;
    } catch (error) {
      console.error("Error saving user:", error);
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<UserData | null> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    try {
      const result = await this.db.getFirstAsync<UserData>(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );

      return result || null;
    } catch (error) {
      console.error("Error getting user:", error);
      throw error;
    }
  }

  async updateUser(
    email: string,
    userData: Partial<Omit<UserData, "password">> & { password?: string }
  ): Promise<void> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (userData.firstName) {
      updates.push("firstName = ?");
      values.push(userData.firstName);
    }
    if (userData.lastName) {
      updates.push("lastName = ?");
      values.push(userData.lastName);
    }
    if (userData.phoneNumber !== undefined) {
      updates.push("phoneNumber = ?");
      values.push(userData.phoneNumber);
    }
    if (userData.password) {
      // Hash the password before updating
      const hashedPassword = await passwordUtils.hashPassword(
        userData.password
      );
      updates.push("password = ?");
      values.push(hashedPassword);
    }

    updates.push("updatedAt = ?");
    values.push(Date.now());

    values.push(email);

    try {
      await this.db.runAsync(
        `UPDATE users SET ${updates.join(", ")} WHERE email = ?`,
        values
      );
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  async deleteUser(email: string): Promise<void> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    try {
      await this.db.runAsync("DELETE FROM users WHERE email = ?", [email]);
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }

  async getAllUsers(): Promise<UserData[]> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    try {
      const result = await this.db.getAllAsync<UserData>("SELECT * FROM users");
      return result;
    } catch (error) {
      console.error("Error getting all users:", error);
      throw error;
    }
  }
}

export const database = new Database();
