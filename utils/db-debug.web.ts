import { database } from "./database";
import { removeDemoAccount, seedDemoAccount } from "./seed-demo";

/**
 * Utility functions for debugging and managing the SQLite database
 */

export const dbDebug = {
  /**
   * Get all users from the database
   * Note: Passwords are hashed and cannot be displayed in plain text
   */
  async getAllUsers() {
    try {
      const users = await database.getAllUsers();
      const sanitizedUsers = users.map((user) => ({
        ...user,
        password: "[HASHED]",
      }));
      console.log("📊 All users in database:", sanitizedUsers);
      return users;
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  },

  /**
   * Get a specific user by email
   * Note: Password is hashed and cannot be displayed in plain text
   */
  async getUser(email: string) {
    try {
      const user = await database.getUserByEmail(email);
      if (user) {
        const sanitizedUser = { ...user, password: "[HASHED]" };
        console.log(`📊 User data for ${email}:`, sanitizedUser);
      } else {
        console.log(`📊 No user found for ${email}`);
      }
      return user;
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  },

  /**
   * Delete a user by email
   */
  async deleteUser(email: string) {
    try {
      await database.deleteUser(email);
      console.log(`✅ User ${email} deleted successfully`);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  },

  /**
   * Clear all users from the database
   */
  async clearAllUsers() {
    try {
      const users = await database.getAllUsers();
      for (const user of users) {
        await database.deleteUser(user.email);
      }
      console.log("✅ All users cleared from database");
    } catch (error) {
      console.error("Error clearing users:", error);
    }
  },

  /**
   * Seed the demo account
   */
  async seedDemo() {
    try {
      const result = await seedDemoAccount();
      return result;
    } catch (error) {
      console.error("Error seeding demo account:", error);
      throw error;
    }
  },

  /**
   * Remove the demo account
   */
  async removeDemo() {
    try {
      const result = await removeDemoAccount();
      return result;
    } catch (error) {
      console.error("Error removing demo account:", error);
      throw error;
    }
  },
};
