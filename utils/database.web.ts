// Web fallback - uses localStorage instead of SQLite
import { passwordUtils as passwordUtilsImpl } from "./password-utils.web";

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
export const passwordUtils = passwordUtilsImpl;

const STORAGE_KEY = "devshowcase_users";

class WebDatabase {
  async init() {
    // No initialization needed for localStorage
    console.log("Using web localStorage (not SQLite)");
  }

  async saveUser(userData: Omit<UserData, "id">): Promise<number> {
    const users = this.getAllUsersSync();
    const newUser = {
      ...userData,
      id: users.length > 0 ? Math.max(...users.map((u) => u.id || 0)) + 1 : 1,
    };
    users.push(newUser as UserData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    return newUser.id;
  }

  async getUserByEmail(email: string): Promise<UserData | null> {
    const users = this.getAllUsersSync();
    return users.find((u) => u.email === email) || null;
  }

  async updateUser(email: string, userData: Partial<UserData>): Promise<void> {
    const users = this.getAllUsersSync();
    const index = users.findIndex((u) => u.email === email);
    if (index !== -1) {
      users[index] = { ...users[index], ...userData, updatedAt: Date.now() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    }
  }

  async deleteUser(email: string): Promise<void> {
    const users = this.getAllUsersSync();
    const filtered = users.filter((u) => u.email !== email);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }

  async getAllUsers(): Promise<UserData[]> {
    return this.getAllUsersSync();
  }

  private getAllUsersSync(): UserData[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }
}

export const database = new WebDatabase();
