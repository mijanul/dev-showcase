import { biometricAuth } from "@/utils/biometric-auth";
import { database, passwordUtils } from "@/utils/database";
import { secureStorage } from "@/utils/secure-storage";
import { seedDemoAccount } from "@/utils/seed-demo";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface User {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

export interface PartialRegistrationData {
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  countryCode?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  failedAttempts: number;
  isLockedOut: boolean;
  lockoutEndTime: number | null;
  partialRegistration: PartialRegistrationData | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithBiometric: () => Promise<void>;
  loginWithDemo: () => Promise<void>;
  signup: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    phoneNumber?: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  savePartialRegistration: (data: PartialRegistrationData) => Promise<void>;
  clearPartialRegistration: () => Promise<void>;
  resetLockout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Secure storage keys
const STORAGE_KEYS = {
  USER_EMAIL: "user_email",
  USER_FIRST_NAME: "user_first_name",
  USER_LAST_NAME: "user_last_name",
  USER_PHONE: "user_phone",
  USER_TOKEN: "user_token",
  CREDENTIALS: "user_credentials",
  FAILED_ATTEMPTS: "failed_login_attempts",
  LOCKOUT_END: "lockout_end_time",
  PARTIAL_REGISTRATION: "partial_registration",
};

export const MAX_FAILED_ATTEMPTS = 5;
export const LOCKOUT_DURATION = 30 * 1000; // 30 seconds in milliseconds

// Demo account email identifier
const DEMO_EMAIL = "hi@mijanul.in";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutEndTime, setLockoutEndTime] = useState<number | null>(null);
  const [partialRegistration, setPartialRegistration] =
    useState<PartialRegistrationData | null>(null);

  useEffect(() => {
    initializeDatabase();
    checkAuthStatus();
    loadFailedAttempts();
    loadPartialRegistration();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initializeDatabase = async () => {
    try {
      await database.init();
      // Seed demo account if it doesn't exist
      await seedDemoAccount();
    } catch (error) {
      console.error("Error initializing database:", error);
    }
  };

  const loadFailedAttempts = async () => {
    try {
      const [attemptsStr, lockoutStr] = await Promise.all([
        secureStorage.getItemAsync(STORAGE_KEYS.FAILED_ATTEMPTS),
        secureStorage.getItemAsync(STORAGE_KEYS.LOCKOUT_END),
      ]);

      if (attemptsStr) {
        setFailedAttempts(parseInt(attemptsStr, 10));
      }

      if (lockoutStr) {
        const lockoutEnd = parseInt(lockoutStr, 10);
        if (lockoutEnd > Date.now()) {
          setLockoutEndTime(lockoutEnd);
        } else {
          // Lockout expired, reset
          await resetLockout();
        }
      }
    } catch (error) {
      console.error("Error loading failed attempts:", error);
    }
  };

  const loadPartialRegistration = async () => {
    try {
      const data = await secureStorage.getItemAsync(
        STORAGE_KEYS.PARTIAL_REGISTRATION
      );
      if (data) {
        setPartialRegistration(JSON.parse(data));
      }
    } catch (error) {
      console.error("Error loading partial registration:", error);
    }
  };

  const checkAuthStatus = async () => {
    try {
      const [email, firstName, lastName, phoneNumber, token] =
        await Promise.all([
          secureStorage.getItemAsync(STORAGE_KEYS.USER_EMAIL),
          secureStorage.getItemAsync(STORAGE_KEYS.USER_FIRST_NAME),
          secureStorage.getItemAsync(STORAGE_KEYS.USER_LAST_NAME),
          secureStorage.getItemAsync(STORAGE_KEYS.USER_PHONE),
          secureStorage.getItemAsync(STORAGE_KEYS.USER_TOKEN),
        ]);

      if (email && firstName && lastName && token) {
        setUser({
          email,
          firstName,
          lastName,
          phoneNumber: phoneNumber || undefined,
        });
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetLockout = async () => {
    try {
      await Promise.all([
        secureStorage.deleteItemAsync(STORAGE_KEYS.FAILED_ATTEMPTS),
        secureStorage.deleteItemAsync(STORAGE_KEYS.LOCKOUT_END),
      ]);
      setFailedAttempts(0);
      setLockoutEndTime(null);
    } catch (error) {
      console.error("Error resetting lockout:", error);
    }
  };

  const login = async (email: string, password: string) => {
    // Check if locked out
    if (lockoutEndTime && lockoutEndTime > Date.now()) {
      const remainingSeconds = Math.ceil((lockoutEndTime - Date.now()) / 1000);
      throw new Error(
        `Too many failed attempts. Please try again in ${remainingSeconds} second(s).`
      );
    }

    try {
      // Simulate API call - Replace with actual authentication
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check user in SQLite database
      const dbUser = await database.getUserByEmail(email);

      if (!dbUser) {
        throw new Error(
          "No account found with this email. Please sign up first."
        );
      }

      // Verify password using bcrypt
      const isPasswordValid = await passwordUtils.comparePassword(
        password,
        dbUser.password
      );

      if (!isPasswordValid) {
        throw new Error("Invalid password. Please try again.");
      }

      // Successful login - reset failed attempts
      await resetLockout();

      // Generate a mock token (in production, this comes from your backend)
      const token = `token_${Date.now()}_${Math.random().toString(36)}`;

      // Store token and user data in secure storage
      await Promise.all([
        secureStorage.setItemAsync(STORAGE_KEYS.USER_EMAIL, dbUser.email),
        secureStorage.setItemAsync(
          STORAGE_KEYS.USER_FIRST_NAME,
          dbUser.firstName
        ),
        secureStorage.setItemAsync(
          STORAGE_KEYS.USER_LAST_NAME,
          dbUser.lastName
        ),
        secureStorage.setItemAsync(STORAGE_KEYS.USER_TOKEN, token),
        ...(dbUser.phoneNumber
          ? [
              secureStorage.setItemAsync(
                STORAGE_KEYS.USER_PHONE,
                dbUser.phoneNumber
              ),
            ]
          : []),
      ]);

      setUser({
        email: dbUser.email,
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        phoneNumber: dbUser.phoneNumber || undefined,
      });
    } catch {
      // Read current attempts from storage to ensure we have the latest value
      const currentAttemptsStr = await secureStorage.getItemAsync(
        STORAGE_KEYS.FAILED_ATTEMPTS
      );
      const currentAttempts = currentAttemptsStr
        ? parseInt(currentAttemptsStr, 10)
        : 0;
      const newAttempts = currentAttempts + 1;

      // Update state and storage
      setFailedAttempts(newAttempts);
      await secureStorage.setItemAsync(
        STORAGE_KEYS.FAILED_ATTEMPTS,
        newAttempts.toString()
      );

      // Lock out after max attempts
      if (newAttempts >= MAX_FAILED_ATTEMPTS) {
        const lockoutEnd = Date.now() + LOCKOUT_DURATION;
        setLockoutEndTime(lockoutEnd);
        await secureStorage.setItemAsync(
          STORAGE_KEYS.LOCKOUT_END,
          lockoutEnd.toString()
        );

        throw new Error(
          `Too many failed attempts. Account locked for 30 seconds.`
        );
      }

      const remainingAttempts = MAX_FAILED_ATTEMPTS - newAttempts;
      throw new Error(
        `Invalid credentials. ${remainingAttempts} attempt(s) remaining.`
      );
    }
  };

  const loginWithBiometric = async () => {
    try {
      // Check if biometric is enabled
      const isEnabled = await biometricAuth.isEnabled();
      if (!isEnabled) {
        throw new Error(
          "Biometric login is not enabled. Please enable it in settings."
        );
      }

      // Authenticate with biometric
      const authenticated = await biometricAuth.authenticate(
        "Login to your account"
      );

      if (!authenticated) {
        throw new Error("Biometric authentication failed");
      }

      // Get stored credentials
      const credentials = await biometricAuth.getStoredCredentials();
      if (!credentials) {
        throw new Error(
          "No saved credentials found. Please login with password and re-enable biometric login."
        );
      }

      // Login with stored credentials
      await login(credentials.email, credentials.password);
    } catch (error) {
      console.error("Biometric login error:", error);
      throw error instanceof Error
        ? error
        : new Error("Biometric login failed");
    }
  };

  const loginWithDemo = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Check if demo user exists in database
      const demoUser = await database.getUserByEmail(DEMO_EMAIL);

      if (!demoUser) {
        throw new Error(
          "Demo account not found. Please create a demo account first by signing up with email: " +
            DEMO_EMAIL
        );
      }

      // Generate a demo token
      const demoToken = `demo_token_${Date.now()}`;

      // Store demo user data in secure storage
      await Promise.all([
        secureStorage.setItemAsync(STORAGE_KEYS.USER_EMAIL, demoUser.email),
        secureStorage.setItemAsync(
          STORAGE_KEYS.USER_FIRST_NAME,
          demoUser.firstName
        ),
        secureStorage.setItemAsync(
          STORAGE_KEYS.USER_LAST_NAME,
          demoUser.lastName
        ),
        secureStorage.setItemAsync(STORAGE_KEYS.USER_TOKEN, demoToken),
        ...(demoUser.phoneNumber
          ? [
              secureStorage.setItemAsync(
                STORAGE_KEYS.USER_PHONE,
                demoUser.phoneNumber
              ),
            ]
          : []),
      ]);

      // Set user state
      setUser({
        email: demoUser.email,
        firstName: demoUser.firstName,
        lastName: demoUser.lastName,
        phoneNumber: demoUser.phoneNumber || undefined,
      });

      // Reset failed attempts on successful login
      await resetLockout();
    } catch (error) {
      console.error("Demo login error:", error);
      throw error instanceof Error
        ? error
        : new Error("Failed to login with demo account");
    }
  };

  const signup = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    phoneNumber?: string
  ) => {
    try {
      // Validate email is not the demo account
      if (email.toLowerCase() === DEMO_EMAIL.toLowerCase()) {
        throw new Error(
          "This email is reserved for the demo account. Please use a different email address."
        );
      }

      // Check if user already exists
      const existingUser = await database.getUserByEmail(email);
      if (existingUser) {
        throw new Error(
          "An account with this email already exists. Please login or use a different email."
        );
      }

      // Simulate API call - Replace with actual registration
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Generate a mock token
      const token = `token_${Date.now()}_${Math.random().toString(36)}`;
      const timestamp = Date.now();

      // Hash the password before storing
      const hashedPassword = await passwordUtils.hashPassword(password);

      // Save user data to SQLite database with hashed password
      await database.saveUser({
        email,
        firstName,
        lastName,
        phoneNumber,
        password: hashedPassword,
        createdAt: timestamp,
        updatedAt: timestamp,
      });

      // Store user data securely
      const promises = [
        secureStorage.setItemAsync(STORAGE_KEYS.USER_EMAIL, email),
        secureStorage.setItemAsync(STORAGE_KEYS.USER_FIRST_NAME, firstName),
        secureStorage.setItemAsync(STORAGE_KEYS.USER_LAST_NAME, lastName),
        secureStorage.setItemAsync(STORAGE_KEYS.USER_TOKEN, token),
      ];

      if (phoneNumber) {
        promises.push(
          secureStorage.setItemAsync(STORAGE_KEYS.USER_PHONE, phoneNumber)
        );
      }

      await Promise.all(promises);

      // Clear partial registration data
      await clearPartialRegistration();

      // Reset failed login attempts on successful signup
      await resetLockout();

      setUser({ email, firstName, lastName, phoneNumber });
    } catch (error) {
      console.error("Signup error:", error);
      // Preserve specific error messages or use generic fallback
      throw error instanceof Error
        ? error
        : new Error("Signup failed. Please try again.");
    }
  };

  const logout = async () => {
    try {
      // Clear all secure storage
      await Promise.all([
        secureStorage.deleteItemAsync(STORAGE_KEYS.USER_EMAIL),
        secureStorage.deleteItemAsync(STORAGE_KEYS.USER_FIRST_NAME),
        secureStorage.deleteItemAsync(STORAGE_KEYS.USER_LAST_NAME),
        secureStorage.deleteItemAsync(STORAGE_KEYS.USER_PHONE),
        secureStorage.deleteItemAsync(STORAGE_KEYS.USER_TOKEN),
        secureStorage.deleteItemAsync(STORAGE_KEYS.CREDENTIALS),
      ]);

      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw new Error("Logout failed. Please try again.");
    }
  };

  const savePartialRegistration = async (data: PartialRegistrationData) => {
    try {
      await secureStorage.setItemAsync(
        STORAGE_KEYS.PARTIAL_REGISTRATION,
        JSON.stringify(data)
      );
      setPartialRegistration(data);
    } catch (error) {
      console.error("Error saving partial registration:", error);
    }
  };

  const clearPartialRegistration = async () => {
    try {
      await secureStorage.deleteItemAsync(STORAGE_KEYS.PARTIAL_REGISTRATION);
      setPartialRegistration(null);
    } catch (error) {
      console.error("Error clearing partial registration:", error);
    }
  };

  const isLockedOut = lockoutEndTime !== null && lockoutEndTime > Date.now();

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        failedAttempts,
        isLockedOut,
        lockoutEndTime,
        partialRegistration,
        login,
        loginWithBiometric,
        loginWithDemo,
        signup,
        logout,
        savePartialRegistration,
        clearPartialRegistration,
        resetLockout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
