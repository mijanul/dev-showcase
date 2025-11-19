import {
  act,
  cleanup,
  renderHook,
  waitFor,
} from "@testing-library/react-native";
import React from "react";
import { AuthProvider, useAuth } from "../../context/auth-context";
import { secureStorage } from "../../utils/secure-storage";

// Mock secure storage
jest.mock("../../utils/secure-storage", () => ({
  secureStorage: {
    getItemAsync: jest.fn(),
    setItemAsync: jest.fn(),
    deleteItemAsync: jest.fn(),
  },
}));

describe("AuthContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (secureStorage.getItemAsync as jest.Mock).mockResolvedValue(null);
    (secureStorage.setItemAsync as jest.Mock).mockResolvedValue(undefined);
    (secureStorage.deleteItemAsync as jest.Mock).mockResolvedValue(undefined);
  });

  afterEach(() => {
    cleanup();
  });

  describe("signup", () => {
    it("should create a new user account", async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.signup(
          "John",
          "Doe",
          "john@example.com",
          "Password123!",
          "+11234567890"
        );
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toMatchObject({
        email: "john@example.com",
        firstName: "John",
        lastName: "Doe",
        phoneNumber: "+11234567890",
      });

      expect(secureStorage.setItemAsync).toHaveBeenCalledWith(
        "user_email",
        "john@example.com"
      );
      expect(secureStorage.setItemAsync).toHaveBeenCalledWith(
        "user_first_name",
        "John"
      );
      expect(secureStorage.setItemAsync).toHaveBeenCalledWith(
        "user_last_name",
        "Doe"
      );
    });

    it("should handle signup without phone number", async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.signup(
          "Jane",
          "Smith",
          "jane@example.com",
          "SecurePass123!"
        );
      });

      expect(result.current.user?.phoneNumber).toBeUndefined();
    });
  });

  describe("login", () => {
    it("should login successfully with valid credentials", async () => {
      (secureStorage.getItemAsync as jest.Mock).mockImplementation(
        (key: string) => {
          const mockData: Record<string, string> = {
            user_email: "john@example.com",
            user_credentials: JSON.stringify({
              password: "Password123!",
              createdAt: Date.now(),
            }),
            user_first_name: "John",
            user_last_name: "Doe",
          };
          return Promise.resolve(mockData[key] || null);
        }
      );

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.login("john@example.com", "Password123!");
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.failedAttempts).toBe(0);
    });

    it("should increment failed attempts on invalid credentials", async () => {
      (secureStorage.getItemAsync as jest.Mock).mockImplementation(
        (key: string) => {
          const mockData: Record<string, string> = {
            user_email: "john@example.com",
            user_credentials: JSON.stringify({
              password: "CorrectPassword",
              createdAt: Date.now(),
            }),
          };
          return Promise.resolve(mockData[key] || null);
        }
      );

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      try {
        await act(async () => {
          await result.current.login("john@example.com", "WrongPassword");
        });
      } catch {
        // Expected to throw
      }

      // Verify that failed attempts were saved to storage
      await waitFor(() => {
        expect(secureStorage.setItemAsync).toHaveBeenCalledWith(
          "failed_login_attempts",
          "1"
        );
      });
    });

    it("should lock account after 5 failed attempts", async () => {
      (secureStorage.getItemAsync as jest.Mock).mockImplementation(
        (key: string) => {
          if (key === "failed_login_attempts") {
            return Promise.resolve("4");
          }
          const mockData: Record<string, string> = {
            user_email: "john@example.com",
            user_credentials: JSON.stringify({
              password: "CorrectPassword",
            }),
          };
          return Promise.resolve(mockData[key] || null);
        }
      );

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.failedAttempts).toBe(4);
      });

      let errorThrown = false;
      try {
        await act(async () => {
          await result.current.login("john@example.com", "WrongPassword");
        });
      } catch (error: any) {
        errorThrown = true;
        expect(error.message).toContain("Too many failed attempts");
      }

      expect(errorThrown).toBe(true);

      // Verify lockout was saved to storage
      await waitFor(() => {
        expect(secureStorage.setItemAsync).toHaveBeenCalledWith(
          "failed_login_attempts",
          "5"
        );
        expect(secureStorage.setItemAsync).toHaveBeenCalledWith(
          "lockout_end_time",
          expect.any(String)
        );
      });
    });
  });

  describe("logout", () => {
    it("should clear all user data and session", async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // First signup
      await act(async () => {
        await result.current.signup(
          "John",
          "Doe",
          "john@example.com",
          "Password123!"
        );
      });

      expect(result.current.isAuthenticated).toBe(true);

      // Then logout
      await act(async () => {
        await result.current.logout();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(secureStorage.deleteItemAsync).toHaveBeenCalledWith("user_email");
      expect(secureStorage.deleteItemAsync).toHaveBeenCalledWith(
        "user_first_name"
      );
      expect(secureStorage.deleteItemAsync).toHaveBeenCalledWith(
        "user_last_name"
      );
    });
  });

  describe("partial registration", () => {
    it("should save and retrieve partial registration data", async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const partialData = {
        email: "john@example.com",
        firstName: "John",
        lastName: "Doe",
      };

      await act(async () => {
        await result.current.savePartialRegistration(partialData);
      });

      expect(secureStorage.setItemAsync).toHaveBeenCalledWith(
        "partial_registration",
        JSON.stringify(partialData)
      );
    });

    it("should clear partial registration after successful signup", async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.signup(
          "John",
          "Doe",
          "john@example.com",
          "Password123!"
        );
      });

      expect(secureStorage.deleteItemAsync).toHaveBeenCalledWith(
        "partial_registration"
      );
    });
  });
});
